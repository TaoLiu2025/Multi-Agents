import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Minus,
  AlertTriangle, 
  CheckCircle, 
  Users,
  Clock,
  Target,
  Award,
  ThumbsUp,
  FileCheck,
  Timer,
  Flag,
  XCircle,
  SkipForward
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

interface KPIMetrics {
  totalAnnotated: number;
  totalAssigned: number;
  overallPassRate: number;
  avgTimePerImage: number;
  flaggedAnnotators: number;
  avgQualityScore: number;
}

interface TaskLifecycle {
  totalAssigned: number;
  completed: { count: number; percentage: number };
  inProgress: { count: number; percentage: number };
  abandoned: { count: number; percentage: number };
  skipped: { count: number; percentage: number };
  returnedForRework: { count: number; percentage: number };
}

interface AnnotatorPerformance {
  name: string;
  imagesAnnotated: number;
  avgTimePerAnnotation: number;
  speedFlag: 'Too Fast' | 'Normal' | 'Too Slow';
  streakingPercentage: number;
  tasksSentBack: { count: number; percentage: number };
  avgFeedbackRounds: number;
  qualityTrend: { direction: 'improving' | 'flat' | 'declining'; percentage: number };
  skipAbandonmentCount: number;
  skipRatePct: number;
  textSimilarityRatePct: number;
  overallStatus: 'excellent' | 'good' | 'warning' | 'critical';
}

interface ImageScoreData {
  imageId: string; // use image pair id/taskid for x-axis labels
  score: number;
}

interface GuidelinePassFail {
  guideline: string;
  pass: number;
  fail: number;
  notSure: number;
  na: number;
}

interface IssueDistribution {
  issueType: string;
  count: number;
}

export function QualityDashboard() {
  // KPI Metrics Data
  const kpiMetrics: KPIMetrics = {
    totalAnnotated: 2847,
    totalAssigned: 3200,
    overallPassRate: 84.3,
    avgTimePerImage: 4.7,
    flaggedAnnotators: 3,
    avgQualityScore: 87.6
  };

  // Task Lifecycle Data
  const taskLifecycle: TaskLifecycle = {
    totalAssigned: 3200,
    completed: { count: 2847, percentage: 88.97 },
    inProgress: { count: 198, percentage: 6.19 },
    abandoned: { count: 45, percentage: 1.41 },
    skipped: { count: 67, percentage: 2.09 },
    returnedForRework: { count: 43, percentage: 1.34 }
  };

  // Annotator Performance Data
  const annotatorPerformance: AnnotatorPerformance[] = [
    { 
      name: 'Sarah Chen', 
      imagesAnnotated: 487, 
      avgTimePerAnnotation: 4.2, 
      speedFlag: 'Normal',
      streakingPercentage: 2.1,
      tasksSentBack: { count: 8, percentage: 1.6 },
      avgFeedbackRounds: 1.3,
      qualityTrend: { direction: 'improving', percentage: 12.3 },
      skipAbandonmentCount: 3,
      skipRatePct: 0.8,
      textSimilarityRatePct: 5.9,
      overallStatus: 'excellent'
    },
    { 
      name: 'Mike Johnson', 
      imagesAnnotated: 423, 
      avgTimePerAnnotation: 3.8, 
      speedFlag: 'Normal',
      streakingPercentage: 3.4,
      tasksSentBack: { count: 12, percentage: 2.8 },
      avgFeedbackRounds: 1.7,
      qualityTrend: { direction: 'flat', percentage: 0.5 },
      skipAbandonmentCount: 5,
      skipRatePct: 1.4,
      textSimilarityRatePct: 8.3,
      overallStatus: 'good'
    },
    { 
      name: 'Emily Davis', 
      imagesAnnotated: 398, 
      avgTimePerAnnotation: 5.1, 
      speedFlag: 'Normal',
      streakingPercentage: 1.8,
      tasksSentBack: { count: 6, percentage: 1.5 },
      avgFeedbackRounds: 1.2,
      qualityTrend: { direction: 'improving', percentage: 8.7 },
      skipAbandonmentCount: 2,
      skipRatePct: 0.6,
      textSimilarityRatePct: 4.2,
      overallStatus: 'excellent'
    },
    { 
      name: 'James Wilson', 
      imagesAnnotated: 356, 
      avgTimePerAnnotation: 2.9, 
      speedFlag: 'Too Fast',
      streakingPercentage: 15.7,
      tasksSentBack: { count: 28, percentage: 7.9 },
      avgFeedbackRounds: 2.2,
      qualityTrend: { direction: 'declining', percentage: -5.2 },
      skipAbandonmentCount: 12,
      skipRatePct: 3.3,
      textSimilarityRatePct: 16.1,
      overallStatus: 'warning'
    },
    { 
      name: 'Lisa Brown', 
      imagesAnnotated: 334, 
      avgTimePerAnnotation: 4.5, 
      speedFlag: 'Normal',
      streakingPercentage: 4.2,
      tasksSentBack: { count: 10, percentage: 3.0 },
      avgFeedbackRounds: 1.5,
      qualityTrend: { direction: 'flat', percentage: -0.8 },
      skipAbandonmentCount: 7,
      skipRatePct: 2.1,
      textSimilarityRatePct: 7.7,
      overallStatus: 'good'
    },
    { 
      name: 'David Martinez', 
      imagesAnnotated: 312, 
      avgTimePerAnnotation: 6.8, 
      speedFlag: 'Too Slow',
      streakingPercentage: 3.1,
      tasksSentBack: { count: 9, percentage: 2.9 },
      avgFeedbackRounds: 1.9,
      qualityTrend: { direction: 'improving', percentage: 4.3 },
      skipAbandonmentCount: 4,
      skipRatePct: 1.0,
      textSimilarityRatePct: 6.5,
      overallStatus: 'good'
    },
    { 
      name: 'Anna Lee', 
      imagesAnnotated: 298, 
      avgTimePerAnnotation: 2.3, 
      speedFlag: 'Too Fast',
      streakingPercentage: 22.4,
      tasksSentBack: { count: 45, percentage: 15.1 },
      avgFeedbackRounds: 2.4,
      qualityTrend: { direction: 'declining', percentage: -12.6 },
      skipAbandonmentCount: 18,
      skipRatePct: 5.7,
      textSimilarityRatePct: 19.8,
      overallStatus: 'critical'
    },
    { 
      name: 'Tom Anderson', 
      imagesAnnotated: 239, 
      avgTimePerAnnotation: 5.8, 
      speedFlag: 'Normal',
      streakingPercentage: 5.6,
      tasksSentBack: { count: 18, percentage: 7.5 },
      avgFeedbackRounds: 1.8,
      qualityTrend: { direction: 'declining', percentage: -3.4 },
      skipAbandonmentCount: 14,
      skipRatePct: 3.9,
      textSimilarityRatePct: 9.4,
      overallStatus: 'warning'
    }
  ];

  // Image by Score Data (Scatter Plot) - computed from CSVs locally
  const [imageScoreData, setImageScoreData] = useState<ImageScoreData[]>([]);

  // Lightweight CSV parsing helpers (mirrors QAResults-Mississippi)
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

  const parseCSV = (text: string): Array<Record<string, string>> => {
    const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim().length > 0);
    if (lines.length === 0) return [];
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
    return rows;
  };

  const getField = (row: Record<string, string>, candidates: string[]): string => {
    const keys = Object.keys(row);
    const lowerToOrig = new Map<string, string>();
    keys.forEach(k => lowerToOrig.set(k.toLowerCase(), k));
    for (const cand of candidates) {
      if (row[cand] !== undefined) return row[cand];
      const lc = cand.toLowerCase();
      if (lowerToOrig.has(lc)) {
        const orig = lowerToOrig.get(lc)!;
        return row[orig] ?? '';
      }
    }
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

  const normalizeAnswer = (raw: string | undefined): 'Yes' | 'No' | 'Not Sure' => {
    if (!raw) return 'Not Sure';
    const v = raw.trim().toLowerCase();
    if (v.startsWith('yes')) return 'Yes';
    if (v.startsWith('no humans')) return 'Yes';
    if (v === 'no') return 'No';
    return 'Not Sure';
  };

  const fetchFirstExisting = async (paths: string[]): Promise<string> => {
    for (const p of paths) {
      try {
        const res = await fetch(p);
        if (res.ok) return await res.text();
      } catch {}
    }
    throw new Error('CSV not found');
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
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
        } catch { analysisText = null; }

        const alignedRows = parseCSV(alignedText);
        const analysisRows = analysisText ? parseCSV(analysisText) : [];
        const analysisByTaskId = new Map<string, Record<string, string>>();
        analysisRows.forEach(r => { if (r.taskid) analysisByTaskId.set(r.taskid, r); });

        const data: ImageScoreData[] = [];
        alignedRows.forEach((r, idx) => {
          const taskid = getField(r, ['taskid']);
          const asin = getField(r, ['asin']);
          const a = taskid ? analysisByTaskId.get(taskid) : undefined;

          const pf = a ? normalizeAnswer(a.product_fidelity) : normalizeAnswer(r['Product Fidelity - Pass']);
          const sd = a ? normalizeAnswer(a.scene_defects) : normalizeAnswer(r['Scene Defects - Pass']);
          const hd = a ? normalizeAnswer(a.human_defects) : normalizeAnswer(r['Human Defects - Pass']);

          const deductions = [pf, sd, hd].filter(ans => ans !== 'Yes').length;
          const rawScore = 100 - deductions * (100 / 3);
          const score = Math.max(0, Math.round(rawScore));

          const imageId = taskid || asin || String(idx + 1);
          data.push({ imageId, score });
        });

        if (!cancelled) setImageScoreData(data);
      } catch {
        if (!cancelled) setImageScoreData([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Pass/Fail by Guideline Data
  const guidelinePassFail: GuidelinePassFail[] = [
    { guideline: 'Q1: Product Representation', pass: 78, fail: 12, notSure: 7, na: 3 },
    { guideline: 'Q2: Scene Plausibility', pass: 65, fail: 22, notSure: 10, na: 3 },
    { guideline: 'Q3: Anatomy', pass: 82, fail: 8, notSure: 6, na: 4 }
  ];

  // Common Issue Distribution Data
  const issueDistribution: IssueDistribution[] = [
    { issueType: 'Product Scale', count: 87 },
    { issueType: 'Floating Objects', count: 65 },
    { issueType: 'Occlusion Issues', count: 54 },
    { issueType: 'Lighting Problems', count: 43 },
    { issueType: 'Anatomy Errors', count: 38 },
    { issueType: 'Perspective Issues', count: 32 },
    { issueType: 'Color Mismatch', count: 28 },
    { issueType: 'Shadow Problems', count: 21 }
  ];

  const getSpeedFlagColor = (flag: string) => {
    switch (flag) {
      case 'Too Fast': return 'bg-red-600 text-white';
      case 'Too Slow': return 'bg-orange-600 text-white';
      default: return 'bg-green-600 text-white';
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string, inTable?: boolean) => {
    switch (status) {
      case 'excellent': return <Badge className="bg-green-600 text-white">Excellent</Badge>;
      case 'good': return <Badge className="bg-blue-600 text-white">Good</Badge>;
      case 'warning': return <Badge className="bg-orange-600 text-white">Warning</Badge>;
      case 'critical': return <Badge className="bg-red-600 text-white">Critical</Badge>;
      default: return <Badge variant="outline" className="text-black">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* KPIs - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Completion Rate</p>
              <FileCheck className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mb-1">
              {kpiMetrics.totalAnnotated} / {kpiMetrics.totalAssigned}
            </div>
            <p className="text-blue-600">
              {((kpiMetrics.totalAnnotated / kpiMetrics.totalAssigned) * 100).toFixed(1)}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Overall Pass Rate</p>
              <ThumbsUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="mb-1">{kpiMetrics.overallPassRate}%</div>
            <p className="text-green-600">+2.4% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Avg Time/Image</p>
              <Timer className="w-4 h-4 text-purple-500" />
            </div>
            <div className="mb-1">{kpiMetrics.avgTimePerImage} min</div>
            <p className="text-green-600">-8% faster</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Flagged Annotators</p>
              <Flag className="w-4 h-4 text-red-500" />
            </div>
            <div className="mb-1">{kpiMetrics.flaggedAnnotators}</div>
            <p className="text-red-600">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Avg Quality Score</p>
              <Award className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="mb-1">{kpiMetrics.avgQualityScore}%</div>
            <p className="text-green-600">+1.8% improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Task Lifecycle Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Task Lifecycle Metrics</span>
          </CardTitle>
          <CardDescription>Current status breakdown of all assigned tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-900">Total Tasks Assigned</p>
                <p className="text-blue-600 mt-1">{taskLifecycle.totalAssigned.toLocaleString()} tasks</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Completed</span>
                </div>
                <Badge className="bg-green-600">{taskLifecycle.completed.percentage.toFixed(2)}%</Badge>
              </div>
              <p className="text-gray-900">{taskLifecycle.completed.count.toLocaleString()} tasks</p>
              <Progress value={taskLifecycle.completed.percentage} className="mt-2 h-2" />
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span>In Progress</span>
                </div>
                <Badge className="bg-blue-600">{taskLifecycle.inProgress.percentage.toFixed(2)}%</Badge>
              </div>
              <p className="text-gray-900">{taskLifecycle.inProgress.count.toLocaleString()} tasks</p>
              <Progress value={taskLifecycle.inProgress.percentage} className="mt-2 h-2" />
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span>Abandoned</span>
                </div>
                <Badge className="bg-red-600">{taskLifecycle.abandoned.percentage.toFixed(2)}%</Badge>
              </div>
              <p className="text-gray-900">{taskLifecycle.abandoned.count.toLocaleString()} tasks</p>
              <Progress value={taskLifecycle.abandoned.percentage} className="mt-2 h-2" />
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <SkipForward className="w-5 h-5 text-orange-500" />
                  <span>Skipped</span>
                </div>
                <Badge className="bg-orange-600">{taskLifecycle.skipped.percentage.toFixed(2)}%</Badge>
              </div>
              <p className="text-gray-900">{taskLifecycle.skipped.count.toLocaleString()} tasks</p>
              <Progress value={taskLifecycle.skipped.percentage} className="mt-2 h-2" />
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span>Returned for Rework</span>
                </div>
                <Badge className="bg-yellow-600">{taskLifecycle.returnedForRework.percentage.toFixed(2)}%</Badge>
              </div>
              <p className="text-gray-900">{taskLifecycle.returnedForRework.count.toLocaleString()} tasks</p>
              <Progress value={taskLifecycle.returnedForRework.percentage} className="mt-2 h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Annotator Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Annotator Performance Overview</span>
          </CardTitle>
          <CardDescription>Comprehensive performance metrics for all annotators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Annotator Name</TableHead>
                  <TableHead>Images Annotated</TableHead>
                  <TableHead>Avg Time</TableHead>
                  <TableHead>Speed Flag</TableHead>
                  <TableHead>Streaking %</TableHead>
                  <TableHead>Review Lifecycle</TableHead>
                  <TableHead>Quality Trend</TableHead>
                  <TableHead>Skip/Abandon</TableHead>
                  <TableHead>Text Similarity</TableHead>
                  <TableHead>Alignment Over Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {annotatorPerformance.map((annotator, index) => (
                  <TableRow key={index}>
                    <TableCell>{annotator.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{annotator.imagesAnnotated}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Timer className="w-4 h-4 text-gray-500" />
                        <span>{annotator.avgTimePerAnnotation} min</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge>{annotator.speedFlag}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className={annotator.streakingPercentage > 10 ? 'text-red-600' : 'text-green-600'}>
                          {annotator.streakingPercentage}%
                        </span>
                        {annotator.streakingPercentage > 10 && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                    <div className="space-y-1">
                      <span>{annotator.tasksSentBack.count} sent back</span>
                      <p className={annotator.tasksSentBack.percentage > 5 ? 'text-red-600' : 'text-gray-600'}>
                        ({annotator.tasksSentBack.percentage}%) • {annotator.avgFeedbackRounds.toFixed(1)} avg rounds
                      </p>
                    </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(annotator.qualityTrend.direction)}
                        <span className={
                          annotator.qualityTrend.direction === 'improving' ? 'text-green-600' :
                          annotator.qualityTrend.direction === 'declining' ? 'text-red-600' :
                          'text-gray-600'
                        }>
                          {annotator.qualityTrend.percentage > 0 ? '+' : ''}{annotator.qualityTrend.percentage}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                    <div className="space-y-1">
                      <span>{annotator.skipAbandonmentCount} tasks</span>
                      <p className={annotator.skipRatePct > 3 ? 'text-red-600' : 'text-gray-600'}>
                        ({annotator.skipRatePct}%)
                      </p>
                    </div>
                    </TableCell>
                  <TableCell>
                    <span className={annotator.textSimilarityRatePct > 15 ? 'text-red-600' : 'text-gray-700'}>
                      {annotator.textSimilarityRatePct}% high similarity
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(annotator.qualityTrend.direction)}
                      <span className={
                        annotator.qualityTrend.direction === 'improving' ? 'text-green-600' : 'text-red-600'
                      }>
                        {annotator.avgFeedbackRounds >= 2 && annotator.qualityTrend.direction !== 'improving' ? 'No improvement' : 'Improving'}
                      </span>
                    </div>
                  </TableCell>
                    <TableCell><Badge>{annotator.overallStatus}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* Chart 0: Image by Score Scatter Plot */}
        <Card>
          <CardHeader>
            <CardTitle>Image by Score Distribution</CardTitle>
            <CardDescription>Scatter plot showing score distribution across annotated images</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="category" dataKey="imageId" name="Image Pair ID" />
                <YAxis type="number" dataKey="score" name="Score" domain={[0, 100]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Image Score" data={imageScoreData} fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 1: Pass/Fail by Guideline */}
        <Card>
          <CardHeader>
            <CardTitle>Pass/Fail by Guideline</CardTitle>
            <CardDescription>Stacked bar chart showing assessment results for each guideline category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={guidelinePassFail} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="guideline" type="category" width={200} />
                <Tooltip />
                <Legend />
                <Bar dataKey="pass" stackId="a" fill="#10b981" name="Pass %" />
                <Bar dataKey="fail" stackId="a" fill="#ef4444" name="Fail %" />
                <Bar dataKey="notSure" stackId="a" fill="#f59e0b" name="Not Sure %" />
                <Bar dataKey="na" stackId="a" fill="#9ca3af" name="N/A %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 2: Common Issue Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Fine-Grained Common Issue Distribution</CardTitle>
            <CardDescription>Bar chart showing the most frequently occurring quality issues</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={issueDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="issueType" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8b5cf6" name="Issue Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
