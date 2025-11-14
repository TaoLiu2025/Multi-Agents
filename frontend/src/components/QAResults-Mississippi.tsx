import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { 
  CheckCircle, 
  XCircle,
  HelpCircle,
  Shield,
  Eye,
  Users,
  ChevronRight,
  Save,
  Image as ImageIcon,
  Copy,
  Tag
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface FailedCriterion {
  id: number;
  description: string;
  selected?: boolean;
}

interface AgentAssessment {
  name: string;
  question: string;
  answer: 'Yes' | 'No' | 'Not Sure';
  confidence: number;
  availableCriteria: FailedCriterion[];
  reasoning?: string;
}

interface QualityCheck {
  name: string;
  status: 'pass' | 'fail';
  score?: number;
}

interface PreAnnotationChecks {
  imageQuality: {
    status: 'pass' | 'fail';
    qualityScore: number;
    checks: QualityCheck[];
  };
  deduplication: {
    status: 'pass' | 'fail';
    isDuplicate: boolean;
    similarImageIds: string[];
  };
  categoryTagger: {
    tags: string[];
    confidence: { [key: string]: number };
  };
}

interface ImagePair {
  id: string;
  name: string;
  originalImage: string;
  enhancedImage: string;
  assessments: {
    productFidelity: AgentAssessment;
    sceneDefects: AgentAssessment;
    humanDefects: AgentAssessment;
  };
  preAnnotationChecks: PreAnnotationChecks;
  status: 'pending' | 'approved' | 'rejected';
}

// Current answers state for the selected image pair
interface CurrentAssessmentState {
  productFidelity: {
    answer: 'Yes' | 'No' | 'Not Sure';
    selectedCriteria: number[];
  };
  sceneDefects: {
    answer: 'Yes' | 'No' | 'Not Sure';
    selectedCriteria: number[];
  };
  humanDefects: {
    answer: 'Yes' | 'No' | 'Not Sure';
    selectedCriteria: number[];
  };
}

export function QAResults() {
  // Helper: lightweight CSV parser supporting quoted fields with commas
  const parseCSV = (text: string): Array<Record<string, string>> => {
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim().length > 0);
    if (lines.length === 0) return [];
    // Strip BOM if present
    if (lines[0].charCodeAt(0) === 0xfeff) {
      lines[0] = lines[0].slice(1);
    }
    const headers = splitCSVLine(lines[0]).map(h => h.trim());
    const rows: Array<Record<string, string>> = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = splitCSVLine(lines[i]);
      if (cols.length === 1 && cols[0] === '') continue;
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = (cols[idx] ?? '').trim();
      });
      rows.push(row);
    }
    try {
      // eslint-disable-next-line no-console
      console.log('[Mississippi] CSV headers:', headers);
      // eslint-disable-next-line no-console
      console.log('[Mississippi] First row sample:', rows[0]);
    } catch {}
    return rows;
  };

  const splitCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  };

  const getField = (row: Record<string, string>, candidates: string[]): string => {
    const keys = Object.keys(row);
    const lowerToOrig = new Map<string, string>();
    keys.forEach(k => lowerToOrig.set(k.toLowerCase(), k));
    for (const cand of candidates) {
      // exact
      if (row[cand] !== undefined) return row[cand];
      // lower-case match
      const lc = cand.toLowerCase();
      if (lowerToOrig.has(lc)) {
        const orig = lowerToOrig.get(lc)!;
        return row[orig] ?? '';
      }
    }
    // normalized: strip non-word and spaces
    const normMap = new Map<string, string>();
    keys.forEach(k => normMap.set(k.toLowerCase().replace(/[^a-z0-9]+/g, ''), k));
    for (const cand of candidates) {
      const norm = cand.toLowerCase().replace(/[^a-z0-9]+/g, '');
      if (normMap.has(norm)) {
        const orig = normMap.get(norm)!;
        return row[orig] ?? '';
      }
    }
    return '';
  };

  // Available criteria for each agent
  const productFidelityCriteria: FailedCriterion[] = [
    { id: 1, description: 'No critical parts added/removed from main product' },
    { id: 2, description: 'Packaging/labelling is correct' },
    { id: 3, description: 'Shown at reasonable scale relative to scene' },
    { id: 4, description: 'Used correctly if being used' },
    { id: 5, description: 'Product is prominent and not obscured' },
    { id: 6, description: 'Main product looks identical to original' }
  ];

  const sceneDefectsCriteria: FailedCriterion[] = [
    { id: 1, description: 'No unrealistic scenarios or floating objects' },
    { id: 2, description: 'No animated elements in photorealistic scenes' },
    { id: 3, description: 'No physically impossible situations' },
    { id: 4, description: 'No impossible shadows/reflections' },
    { id: 5, description: 'No similar/duplicative products' },
    { id: 6, description: 'Product not placed precariously' },
    { id: 7, description: 'Everything appears "normal" and cohesive' }
  ];

  const humanDefectsCriteria: FailedCriterion[] = [
    { id: 1, description: 'Correct number of fingers/limbs' },
    { id: 2, description: 'Natural poses and joint positions' },
    { id: 3, description: 'Realistic features/complexion' },
    { id: 4, description: 'Complete bodies (no severed parts)' },
    { id: 5, description: 'Natural integration into scene' }
  ];

  const [imagePairs, setImagePairs] = useState<ImagePair[]>([]);
  const [selectedPair, setSelectedPair] = useState<ImagePair | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      setLoadError(null);
      try {
        // Try common served paths from public/. Adjust names if needed.
        const alignedPaths = [
          '/Aligned_gold.csv',
          '/aligned_gold.csv',
          '/aligned-gold.csv',
          '/Aligned%20gold(gold%20in%20DF).csv'
        ];
        const analysisPaths = ['/analysis_results.csv'];

        const alignedText = await fetchFirstExisting(alignedPaths);
        let analysisText: string | null = null;
        try {
          analysisText = await fetchFirstExisting(analysisPaths);
        } catch {
          analysisText = null; // analysis is optional for initial image display
        }

        const alignedRows = parseCSV(alignedText);
        try { console.log('[Mississippi] Loaded aligned CSV rows:', alignedRows.length); } catch {}
        const analysisRows = analysisText ? parseCSV(analysisText) : [];

        // Index analysis by taskid for fast join
        const analysisByTaskId = new Map<string, Record<string, string>>();
        analysisRows.forEach(r => {
          if (r.taskid) analysisByTaskId.set(r.taskid, r);
        });

        const pairs: ImagePair[] = [];
        for (const r of alignedRows) {
          const taskid = getField(r, ['taskid']);
          const asin = getField(r, ['asin']);
          const a = taskid ? analysisByTaskId.get(taskid) : undefined;
          // Prefer LLM analysis if present; otherwise infer from aligned CSV pass columns
          const pf = a ? normalizeAnswer(a.product_fidelity) : normalizeAnswer(r['Product Fidelity - Pass']);
          const sd = a ? normalizeAnswer(a.scene_defects) : normalizeAnswer(r['Scene Defects - Pass']);
          const hdRaw = a ? a.human_defects : r['Human Defects - Pass'];
          const hd = normalizeAnswer(hdRaw);

          const pfConf = a ? toNumber(a.product_fidelity_confidence, 0.9) : 0.9;
          const sdConf = a ? toNumber(a.scene_defects_confidence, 0.9) : 0.9;
          const hdConf = a ? toNumber(a.human_defects_confidence, (hdRaw && hdRaw.toLowerCase().includes('no humans')) ? 1.0 : 0.9) : ((hdRaw && hdRaw.toLowerCase().includes('no humans')) ? 1.0 : 0.9);

          // Extract reasoning from analysis_results (if present)
          const pfReasoning = a ? (getField(a, ['product_fidelity_reasoning', 'product_fidelity_reason', 'product_fidelity_rationale']) || '') : '';
          const sdReasoning = a ? (getField(a, ['scene_defects_reasoning', 'scene_defects_reason', 'scene_defects_rationale']) || '') : '';
          const hdReasoning = a ? (getField(a, ['human_defects_reasoning', 'human_defects_reason', 'human_defects_rationale']) || '') : '';

          const originalImg = r.original_img?.trim() || '';
          const enhancedImg = r.enhanced_img?.trim() || '';
          const asinUrl = r.asin_url?.trim() || '';

          const pair: ImagePair = {
            id: taskid || asin || Math.random().toString(36).slice(2),
            name: asin ? `ASIN ${asin}` : (taskid ? `Task ${taskid}` : 'Image Pair'),
            originalImage: getField(r, ['original_img','original image','originalimage']) || '',
            enhancedImage: getField(r, ['enhanced_img','enhanced image','enhancedimage']) || '',
            status: (pf === 'Yes' && sd === 'Yes' && hd === 'Yes') ? 'approved' : (pf === 'No' || sd === 'No' || hd === 'No') ? 'rejected' : 'pending',
        preAnnotationChecks: {
          imageQuality: {
                status: 'pass',
                qualityScore: 85,
            checks: [
              { name: 'Minimum resolution (1024x1024)', status: 'pass' },
                  { name: 'Compression artifact detection', status: 'pass', score: 90 },
            ]
          },
          deduplication: {
                status: 'pass',
                isDuplicate: false,
                similarImageIds: []
          },
          categoryTagger: {
                tags: r.product_type ? [r.product_type] : [],
                confidence: r.product_type ? { [r.product_type]: 0.9 } : {}
          }
        },
        assessments: {
          productFidelity: {
            name: 'Agent 1: PRODUCT FIDELITY',
            question: 'Is the product perfectly represented in the enhanced image?',
                answer: pf,
                confidence: pfConf,
                availableCriteria: productFidelityCriteria,
                reasoning: pfReasoning || undefined
          },
          sceneDefects: {
            name: 'Agent 2: SCENE DEFECTS',
            question: 'Is the scene in the enhanced image plausible and free from defects?',
                answer: sd,
                confidence: sdConf,
                availableCriteria: sceneDefectsCriteria,
                reasoning: sdReasoning || undefined
          },
          humanDefects: {
            name: 'Agent 3: HUMAN DEFECTS',
            question: 'If humans/animals are present, are they anatomically correct and naturally posed?',
                answer: hd,
                confidence: hdConf,
                availableCriteria: humanDefectsCriteria,
                reasoning: hdReasoning || undefined
              }
            }
          };
          // Debug: print image URLs to verify they are present and reachable strings
          try {
            // eslint-disable-next-line no-console
            console.log('[Mississippi] Pair', pair.id, 'orig:', pair.originalImage, 'enh:', pair.enhancedImage);
          } catch {}

          pairs.push(pair);
        }

        if (!isCancelled) {
          setImagePairs(pairs);
          const firstPair = pairs[0] ?? null;
          setSelectedPair(firstPair);
          // Initialize assessment state for first pair on load
          if (firstPair) {
            setCurrentAssessment(initializeAssessmentState(firstPair));
          }
          if (pairs.length === 0) setLoadError('No rows found in Aligned_gold.csv.');
        }
      } catch (err: any) {
        if (!isCancelled) {
          setLoadError('Could not load CSV(s). Ensure Aligned_gold.csv is in frontend/public.');
        }
      }
    };

    load();
    return () => { isCancelled = true; };
  }, []);

  const normalizeAnswer = (raw: string | undefined): 'Yes' | 'No' | 'Not Sure' => {
    if (!raw) return 'Not Sure';
    const v = raw.trim().toLowerCase();
    if (v.startsWith('yes')) return 'Yes';
    if (v.startsWith('no humans')) return 'Yes';
    if (v === 'no') return 'No';
    return 'Not Sure';
  };

  const toNumber = (raw: string | undefined, fallback: number): number => {
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };

  const fetchFirstExisting = async (paths: string[]): Promise<string> => {
    let lastError: any;
    for (const p of paths) {
      try {
        const res = await fetch(p);
        if (res.ok) {
          try { console.log('[Mississippi] Using CSV path:', p); } catch {}
          return await res.text();
        }
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError || new Error('No CSV found');
  };

  // Initialize current assessment state from selected pair
  const initializeAssessmentState = (pair: ImagePair): CurrentAssessmentState => {
    return {
      productFidelity: {
        answer: pair.assessments.productFidelity.answer,
        selectedCriteria: pair.assessments.productFidelity.availableCriteria
          .filter(c => c.selected)
          .map(c => c.id)
      },
      sceneDefects: {
        answer: pair.assessments.sceneDefects.answer,
        selectedCriteria: pair.assessments.sceneDefects.availableCriteria
          .filter(c => c.selected)
          .map(c => c.id)
      },
      humanDefects: {
        answer: pair.assessments.humanDefects.answer,
        selectedCriteria: pair.assessments.humanDefects.availableCriteria
          .filter(c => c.selected)
          .map(c => c.id)
      }
    };
  };

  const [currentAssessment, setCurrentAssessment] = useState<CurrentAssessmentState>(() => (
    selectedPair ? initializeAssessmentState(selectedPair) : {
      productFidelity: { answer: 'Not Sure', selectedCriteria: [] },
      sceneDefects: { answer: 'Not Sure', selectedCriteria: [] },
      humanDefects: { answer: 'Not Sure', selectedCriteria: [] }
    }
  ));
  const [answered, setAnswered] = useState<{ productFidelity: boolean; sceneDefects: boolean; humanDefects: boolean }>({
    productFidelity: false,
    sceneDefects: false,
    humanDefects: false,
  });
  const [otherComments, setOtherComments] = useState<{ productFidelity: string; sceneDefects: string; humanDefects: string }>({
    productFidelity: '',
    sceneDefects: '',
    humanDefects: '',
  });


  // Update assessment state when pair changes
  const handlePairChange = (pair: ImagePair) => {
    try {
      // eslint-disable-next-line no-console
      console.log('[Mississippi] Selected pair URLs:', { original: pair.originalImage, enhanced: pair.enhancedImage });
    } catch {}
    setSelectedPair(pair);
    setCurrentAssessment(initializeAssessmentState(pair));
    setAnswered({ productFidelity: false, sceneDefects: false, humanDefects: false });
    setOtherComments({ productFidelity: '', sceneDefects: '', humanDefects: '' });
  };

  const handleAnswerChange = (
    agent: 'productFidelity' | 'sceneDefects' | 'humanDefects',
    answer: 'Yes' | 'No' | 'Not Sure'
  ) => {
    setCurrentAssessment(prev => ({
      ...prev,
      [agent]: {
        ...prev[agent],
        answer,
        // Clear selected criteria if answer is "Yes"
        selectedCriteria: answer === 'Yes' ? [] : prev[agent].selectedCriteria
      }
    }));
    setAnswered(prev => ({ ...prev, [agent]: true }));
    if (answer !== 'Not Sure') {
      setOtherComments(prev => ({ ...prev, [agent]: '' }));
    }
  };

  const handleOtherCommentChange = (
    agent: 'productFidelity' | 'sceneDefects' | 'humanDefects',
    value: string
  ) => {
    setOtherComments(prev => ({ ...prev, [agent]: value }));
  };

  const handleCriteriaToggle = (
    agent: 'productFidelity' | 'sceneDefects' | 'humanDefects',
    criterionId: number
  ) => {
    setCurrentAssessment(prev => {
      const currentCriteria = prev[agent].selectedCriteria;
      const isSelected = currentCriteria.includes(criterionId);
      
      return {
        ...prev,
        [agent]: {
          ...prev[agent],
          selectedCriteria: isSelected
            ? currentCriteria.filter(id => id !== criterionId)
            : [...currentCriteria, criterionId]
        }
      };
    });
  };

  const handleSubmit = () => {
    if (!selectedPair) return;
    const productAnswer = currentAssessment.productFidelity.answer;
    const sceneAnswer = currentAssessment.sceneDefects.answer;
    const humanAnswer = currentAssessment.humanDefects.answer;

    const productCriteriaCount = currentAssessment.productFidelity.selectedCriteria.length;
    const sceneCriteriaCount = currentAssessment.sceneDefects.selectedCriteria.length;
    const humanCriteriaCount = currentAssessment.humanDefects.selectedCriteria.length;

    console.log('Assessment submitted for:', selectedPair.name);
    console.log('Product Fidelity:', productAnswer, 'Failed Criteria:', productCriteriaCount);
    console.log('Scene Defects:', sceneAnswer, 'Failed Criteria:', sceneCriteriaCount);
    console.log('Human Defects:', humanAnswer, 'Failed Criteria:', humanCriteriaCount);

    toast.success('Assessment submitted successfully!', {
      description: `${selectedPair.name} assessment has been saved.`
    });
  };

  const getAnswerBadge = (answer: string) => {
    switch (answer) {
      case 'Yes':
        return (
          <Badge className="bg-green-600 flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Yes</span>
          </Badge>
        );
      case 'No':
        return (
          <Badge className="bg-red-600 flex items-center space-x-1">
            <XCircle className="w-3 h-3" />
            <span>No</span>
          </Badge>
        );
      case 'Not Sure':
        return (
          <Badge className="bg-orange-600 flex items-center space-x-1">
            <HelpCircle className="w-3 h-3" />
            <span>Not Sure</span>
          </Badge>
        );
      default:
        return <Badge variant="outline">{answer}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-gray-600">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAgentIcon = (agentName: string) => {
    if (agentName.includes('PRODUCT')) {
      return <Shield className="w-5 h-5 text-indigo-600" />;
    }
    if (agentName.includes('SCENE')) {
      return <Eye className="w-5 h-5 text-teal-600" />;
    }
    if (agentName.includes('HUMAN')) {
      return <Users className="w-5 h-5 text-orange-600" />;
    }
    return <Shield className="w-5 h-5 text-gray-600" />;
  };

  const renderAgentCard = (
    assessment: AgentAssessment,
    agentKey: 'productFidelity' | 'sceneDefects' | 'humanDefects'
  ) => {
    const currentAnswer = currentAssessment[agentKey].answer;
    const selectedCriteria = currentAssessment[agentKey].selectedCriteria;

    return (
      <Card key={assessment.name} className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              {getAgentIcon(assessment.name)}
              <div className="flex-1">
                <CardTitle className="mb-1">{assessment.name}</CardTitle>
                <CardDescription>{assessment.question}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-100 text-xs font-bold">AI Conf.</div>
              <span className="text-gray-700" text-xs>
                {(assessment.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Answer Selection */}
            <div>
              <h6 className="mb-3">Assessment (Prefilled by AI)</h6>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAnswerChange(agentKey, 'Yes')}
                  className={`px-3 py-1.5 rounded-md border text-sm inline-flex items-center gap-1 transition-colors whitespace-nowrap font-medium ${
                    currentAnswer === 'Yes'
                      ? 'border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  style={currentAnswer === 'Yes' ? { backgroundColor: '#16a34a', color: '#ffffff', borderColor: '#16a34a' } : undefined}
                >
                  <CheckCircle className="w-4 h-4" />
                    <span>Yes</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswerChange(agentKey, 'No')}
                  className={`px-3 py-1.5 rounded-md border text-sm inline-flex items-center gap-1 transition-colors whitespace-nowrap font-medium ${
                    currentAnswer === 'No'
                      ? 'border-red-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  style={currentAnswer === 'No' ? { backgroundColor: '#dc2626', color: '#ffffff', borderColor: '#dc2626' } : undefined}
                >
                  <XCircle className="w-4 h-4" />
                    <span>No</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswerChange(agentKey, 'Not Sure')}
                  className={`px-3 py-1.5 rounded-md border text-sm inline-flex items-center gap-1 transition-colors whitespace-nowrap font-medium ${
                    currentAnswer === 'Not Sure'
                      ? 'border-orange-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  style={currentAnswer === 'Not Sure' ? { backgroundColor: '#ea580c', color: '#ffffff', borderColor: '#ea580c' } : undefined}
                >
                  <HelpCircle className="w-4 h-4" />
                    <span>Not Sure</span>
                </button>
                </div>
              {currentAnswer === 'Not Sure' && (
                <div className="mt-2">
                  <label htmlFor={`${agentKey}-other`} className="block text-xs text-gray-600 mb-1">Other (required)</label>
                  <input
                    id={`${agentKey}-other`}
                    type="text"
                    value={otherComments[agentKey]}
                    onChange={(e) => handleOtherCommentChange(agentKey, e.target.value)}
                    placeholder="Add a brief comment"
                    className="w-full px-2 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              {currentAnswer === 'No' && assessment.reasoning && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h6 className="text-sm font-semibold text-red-900 mb-1">AI Reasoning:</h6>
                      <p className="text-sm text-red-800 whitespace-pre-wrap">{assessment.reasoning}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Failed Criteria - Only shown if answer is "No" or "Not Sure" */}
            {(currentAnswer === 'No' || currentAnswer === 'Not Sure') && (
              <>
                <Separator />
                <div>
                  <h6 className="mb-3 flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>Select Failed Criteria</span>
                  </h6>
                  <div className="space-y-2">
                    {assessment.availableCriteria.map((criterion) => {
                      const isSelected = selectedCriteria.includes(criterion.id);
                      return (
                        <div
                          key={criterion.id}
                          className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-red-50 border-red-300'
                              : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleCriteriaToggle(agentKey, criterion.id)}
                        >
                          <Checkbox
                            id={`${agentKey}-criterion-${criterion.id}`}
                            checked={isSelected}
                            onCheckedChange={() => handleCriteriaToggle(agentKey, criterion.id)}
                            className="mt-0.5"
                          />
                          <Label
                            htmlFor={`${agentKey}-criterion-${criterion.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            <span
                              className={`flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 ${
                                isSelected ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {criterion.id}
                            </span>
                            <span className={isSelected ? 'text-red-900' : 'text-gray-700'}>
                              {criterion.description}
                            </span>
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                  {selectedCriteria.length > 0 && (
                    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-orange-900">
                        {selectedCriteria.length} criteria marked as failed
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {currentAnswer === 'Yes' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-900">
                    All criteria passed - No issues detected
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {loadError && (
        <Card className="border border-red-300 bg-red-50">
          <CardContent className="py-3 text-red-800">
            {loadError}
          </CardContent>
        </Card>
      )}
      {/* Header */}
      <Card className="border-t-4 border-t-blue-600">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span>QA Results - Image Pair Assessment</span>
          </CardTitle>
          <CardDescription>
            Review and validate AI-assessed quality for original vs enhanced image pairs
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Pre-Annotation Data Quality Checks */}
      {selectedPair && (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h3>Pre-Annotation Data Quality Checks</h3>
          <Badge className="bg-blue-600">Automated Validation</Badge>
        </div>

        {/* Agent 1: Image DPI Checker */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <div>
                  <CardTitle className="mb-1">Agent 1: Image DPI Checker</CardTitle>
                  <CardDescription>Verifies image DPI for print-readiness and clarity</CardDescription>
                </div>
              </div>
              {selectedPair.preAnnotationChecks.imageQuality.status === 'pass' ? (
                <Badge className="bg-green-600">Pass</Badge>
              ) : (
                <Badge className="bg-red-600">Fail</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h6 className="mb-2 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span>DPI Checks</span>
                </h6>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">Minimum DPI (&gt;= 300 for print)</span>
                      </div>
                      <Badge variant="outline">DPI: 300+</Badge>
                    </div>
                </div>
                  <div className="block w-15 flex-shrink-0  text-right">
                    <div className="w-6 h-6 bg-gray-100 flex items-center justify-center overflow-hidden rounded border ml-auto">
                      <img
                        src="/dpi.jpg"
                        alt="High DPI example"
                      />
              </div>
                </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agent 2: De-duplication Agent */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Copy className="w-5 h-5 text-purple-600" />
                <div>
                  <CardTitle className="mb-1">Agent 2: De-duplication Agent</CardTitle>
                  <CardDescription>Detect duplicate or near-duplicate submissions</CardDescription>
                </div>
              </div>
              {selectedPair.preAnnotationChecks.deduplication.status === 'pass' ? (
                <Badge className="bg-green-600">Pass</Badge>
              ) : (
                <Badge className="bg-red-600">Duplicate Found</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                {/* <h6 className="mb-2">Method</h6>
                <p className="text-gray-700 p-2 bg-gray-50 rounded">
                  Perceptual hashing (pHash, dHash)
                </p> */}
              </div>
              
              <Separator />
              
              {selectedPair.preAnnotationChecks.deduplication.isDuplicate ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h6 className="text-red-900 mb-1">Duplicate Detected</h6>
                      <p className="text-red-700 mb-2">
                        Similar images found in database
                      </p>
                      <div className="flex gap-2">
                        {selectedPair.preAnnotationChecks.deduplication.similarImageIds.map((id, idx) => (
                          <Badge key={idx} variant="outline" className="border-red-300 text-red-700">
                            {id}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-900">No duplicates found - Images are unique</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
                </div>
      )}

      {/* Main Layout: Sidebar + Comparison + Agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Sidebar - Image Pair List */}
        <div className="self-start md:sticky md:top-4">
          <Card className="h-[420px] md:h-[calc(100vh-140px)] flex flex-col">
          <CardHeader className="pb-2 border-b">
              <CardTitle>Image Pairs</CardTitle>
              <CardDescription>{imagePairs.length} pairs available (showing first {Math.min(30, imagePairs.length)})</CardDescription>
            </CardHeader>
            <div className="flex-1 overflow-y-auto pr-1 overscroll-contain">
              <div className="p-3 space-y-2">
                {imagePairs.slice(0, 20).map((pair) => (
                  <button
                    key={pair.id}
                    onClick={() => handlePairChange(pair)}
                    className={`w-full p-2 rounded-lg border transition-all text-left relative pl-3 ${
                      pair.status === 'approved'
                        ? 'border-green-400 bg-green-50 hover:border-green-500'
                        : pair.status === 'rejected'
                          ? 'border-red-400 bg-red-50 hover:border-red-500'
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    } ${selectedPair && selectedPair.id === pair.id ? 'ring-2 ring-blue-400' : ''}`}
                  >
                    <span
                      className={`absolute left-0 top-0 h-full w-2 rounded-l ${
                        pair.status === 'approved' ? 'bg-green-600' : pair.status === 'rejected' ? 'bg-red-600' : 'bg-gray-300'
                      }`}
                    />
                    <div className="flex items-center justify-between mb-1">
                      <span className="truncate flex-1 flex items-center gap-2">
                        <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                          pair.status === 'approved' ? 'bg-green-600' : pair.status === 'rejected' ? 'bg-red-600' : 'bg-gray-400'
                        }`} />
                        {pair.name}
                      </span>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 ml-2 ${
                        selectedPair && selectedPair.id === pair.id ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="relative w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={pair.originalImage}
                          alt="Original"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute bottom-1 left-1 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
                          Orig
                        </div>
                      </div>
                      <div className="relative w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={pair.enhancedImage}
                          alt="Enhanced"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute bottom-1 left-1 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
                          Enh
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(pair.status)}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Middle Content - Selected Pair Details + Agents */}
        <div className="space-y-6">
          {!selectedPair && (
          <Card>
              <CardContent className="py-8 text-center text-gray-600">Select an image pair to view details.</CardContent>
            </Card>
          )}
          {selectedPair ? (
          <>
          {/* Image Comparison */}
          <Card className={`${selectedPair?.status === 'approved' ? 'border-green-500 ring-1 ring-green-400' : selectedPair?.status === 'rejected' ? 'border-red-500 ring-1 ring-red-400' : 'border-gray-200'} border-2 relative`}>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedPair.name}</CardTitle>
                  <CardDescription>Compare original and enhanced versions</CardDescription>
                </div>
                {getStatusBadge(selectedPair.status)}
              </div>
            </CardHeader>
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
              selectedPair.status === 'approved' ? 'bg-green-500' : selectedPair.status === 'rejected' ? 'bg-red-500' : 'bg-gray-200'
            }`} />
             <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original Image */}
                <div>
                  <h6 className="mb-1">Original Image</h6>
                  <div className="relative w-full h-48 md:h-56 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 flex items-center justify-center p-2">
                    <ImageWithFallback
                       src={selectedPair?.originalImage || ''}
                      alt="Original"
                       className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Enhanced Image */}
                <div>
                  <h6 className="mb-1">Enhanced Image</h6>
                  <div className="relative w-full h-48 md:h-56 bg-gray-100 rounded-lg overflow-hidden border border-blue-400 flex items-center justify-center p-2">
                    <ImageWithFallback
                       src={selectedPair?.enhancedImage || ''}
                      alt="Enhanced"
                       className="w-full h-full object-contain"
                    />
                  </div>
                   {/* <div className="mt-2 text-xs text-gray-500 break-all">
                    {selectedPair?.enhancedImage}
                  </div> */}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quality Assessment Agents - Below Image Comparison */}
          <div className="flex items-center space-x-2 mb-4">
                <h3>Quality Assessment Agents</h3>
            <Badge>Pre-filled by AI</Badge>
              </div>
          <div className="space-y-4">
            {renderAgentCard((selectedPair as ImagePair).assessments.productFidelity, 'productFidelity')}
            {renderAgentCard((selectedPair as ImagePair).assessments.sceneDefects, 'sceneDefects')}
            {renderAgentCard((selectedPair as ImagePair).assessments.humanDefects, 'humanDefects')}
            </div>

          {/* Submit Button - Below Agents */}
          <Card className="border-t-4 border-t-green-600">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h6 className="mb-1">Submit Assessment</h6>
                </div>
                {(() => {
                  const complete = (key: 'productFidelity' | 'sceneDefects' | 'humanDefects') => {
                    const ans = currentAssessment[key].answer;
                    if (ans === 'Not Sure') return otherComments[key].trim().length > 0;
                    return ans === 'Yes' || ans === 'No';
                  };
                  const allComplete = selectedPair && complete('productFidelity') && complete('sceneDefects') && complete('humanDefects');
                  const enabled = Boolean(allComplete);
                  return (
                    <Button
                      onClick={handleSubmit}
                      disabled={!enabled}
                      aria-disabled={!enabled}
                      className={`flex items-center ${enabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                    >
                  <Save className="w-4 h-4 mr-2" />
                      {enabled ? 'Submit Assessment' : 'Complete all answers'}
                </Button>
                  );
                })()}
              </div>
            </CardContent>
          </Card>

          </>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-600">Agents will appear after selecting a pair.</CardContent>
            </Card>
          )}
        </div>
      </div>
      {/* Floating submit (always visible on md+) */}
      <div className="hidden md:block fixed bottom-4 right-6 z-50">
        {(() => {
          const complete = (key: 'productFidelity' | 'sceneDefects' | 'humanDefects') => {
            const ans = currentAssessment[key].answer;
            if (ans === 'Not Sure') return otherComments[key].trim().length > 0;
            return ans === 'Yes' || ans === 'No';
          };
          const allComplete = selectedPair && complete('productFidelity') && complete('sceneDefects') && complete('humanDefects');
          const enabled = Boolean(allComplete);
          return (
            <Button
              onClick={handleSubmit}
              disabled={!enabled}
              aria-disabled={!enabled}
              className={`shadow-lg flex items-center ${enabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
            >
              <Save className="w-4 h-4 mr-2" />
              {enabled ? 'Submit' : 'Complete all answers'}
            </Button>
          );
        })()}
      </div>
    </div>
  );
}
