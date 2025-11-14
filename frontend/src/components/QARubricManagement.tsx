import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { AlertTriangle, CheckCircle, Edit, Plus, Target, TrendingUp, RefreshCw, Sparkles, Download} from 'lucide-react';
import { Textarea } from './ui/textarea';

const API_BASE = '/api';

interface Evidence {
  quote: string;
  page: number;
}

interface RubricRule {
  id: string;
  errorType: string;
  category?: string;
  description: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  penalty: number;
  adjustmentRule: string;
  validator?: string;
  evidence?: Evidence[];
}

type Props = {
  sessionId?: string | null;
  onRubricsStarted?: () => void;
  onRubricsGenerated?: () => void;
};

export function QARubricManagement({ sessionId: sessionIdProp, onRubricsStarted, onRubricsGenerated }: Props) {
  const [sessionId, setSessionId] = useState<string | null>(sessionIdProp ?? null);
  const [rubricRules, setRubricRules] = useState<RubricRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEvidenceDialogOpen, setIsEvidenceDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RubricRule | null>(null);
  const [viewingEvidence, setViewingEvidence] = useState<RubricRule | null>(null);
  const [formData, setFormData] = useState({
    errorType: '',
    description: '',
    criticality: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    penalty: 20,
    adjustmentRule: ''
  });

  useEffect(() => {
    if (!sessionIdProp) {
      const sid = localStorage.getItem('sessionId');
      if (sid) setSessionId(sid);
    }
  }, [sessionIdProp]);

  useEffect(() => {
    if (sessionId) loadRubrics();
  }, [sessionId]);

  const loadRubrics = async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/rubrics/${sessionId}`);
      if (!res.ok) throw new Error('Failed to load rubrics');
      const data = await res.json();
      setRubricRules(data.rubrics || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRubrics = async () => {
    if (!sessionId) {
      setError('Please complete extraction first');
      return;
    }
    
    setGenerating(true);
    setError(null);
    onRubricsStarted?.(); 
    
    try {
      const res = await fetch(`${API_BASE}/rubrics/${sessionId}/generate`, {
        method: 'POST'
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to generate rubrics');
      }
      
      const data = await res.json();
      setRubricRules(data.rubrics || []);
      onRubricsGenerated?.();
      await loadRubrics();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleEditRule = (rule: RubricRule) => {
    setEditingRule(rule);
    setFormData({
      errorType: rule.errorType,
      description: rule.description,
      criticality: rule.criticality,
      penalty: rule.penalty,
      adjustmentRule: rule.adjustmentRule
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveRule = async () => {
    if (!sessionId) return;
    
    try {
      if (editingRule) {
        await fetch(`${API_BASE}/rubrics/${sessionId}/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingRule.id,
            updates: formData
          })
        });
      } else {
        await fetch(`${API_BASE}/rubrics/${sessionId}/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      
      setIsEditDialogOpen(false);
      setEditingRule(null);
      loadRubrics();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleAcceptRule = async (id: string) => {
    if (!sessionId) return;
    
    try {
      await fetch(`${API_BASE}/rubrics/${sessionId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          updates: { status: 'validated', validator: 'Current User' }
        })
      });
      loadRubrics();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleViewEvidence = (rule: RubricRule) => {
    setViewingEvidence(rule);
    setIsEvidenceDialogOpen(true);
  };

  const handleRejectRule = async (id: string) => {
    if (!sessionId) return;
    
    try {
      await fetch(`${API_BASE}/rubrics/${sessionId}/${id}`, {
        method: 'DELETE'
      });
      loadRubrics();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDownloadRubrics = () => {
    const dataStr = JSON.stringify(rubricRules, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qa-rubric-rules.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>QA Rubric Management</span>
          </CardTitle>
          <CardDescription>
            Generate, review, validate, and adjust rubric categories, penalties, and scoring logic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Button 
              onClick={handleGenerateRubrics} 
              disabled={!sessionId || generating}
            >
              {generating ? 'Generating...' : 'Generate Rubrics from Guidelines'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={loadRubrics}
              disabled={!sessionId || loading}
            >
              Refresh
            </Button>
            
            {!sessionId && (
              <span className="text-xs text-red-600">Complete extraction first</span>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All Rules</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline"
                  onClick={handleDownloadRubrics}
                  disabled={rubricRules.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Rubrics
                </Button>

                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingRule(null);
                      setFormData({
                        errorType: '',
                        description: '',
                        criticality: 'medium',
                        penalty: 20,
                        adjustmentRule: ''
                      });
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Rule
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingRule ? 'Edit Rubric Rule' : 'Create New Rubric Rule'}
                      </DialogTitle>
                      <DialogDescription>
                        Define error types, penalties, and adjustment rules for quality assurance
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="errorType" className="text-right">Error Type</Label>
                        <Input
                          id="errorType"
                          placeholder="e.g., Defect Rate Violation"
                          className="col-span-3"
                          value={formData.errorType}
                          onChange={(e) => setFormData({...formData, errorType: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe the error condition"
                          className="col-span-3"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={3}
                        />
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="criticality" className="text-right">Criticality</Label>
                        <Select 
                          value={formData.criticality}
                          onValueChange={(value: any) => setFormData({...formData, criticality: value})}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="penalty" className="text-right">Penalty (%)</Label>
                        <div className="col-span-3 space-y-2">
                          <Slider
                            value={[formData.penalty]}
                            onValueChange={(vals) => setFormData({...formData, penalty: vals[0]})}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                          <div className="text-sm text-gray-600">{formData.penalty}%</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="adjustmentRule" className="text-right">Adjustment Rule</Label>
                        <Textarea
                          id="adjustmentRule"
                          placeholder="Define corrective action"
                          className="col-span-3"
                          value={formData.adjustmentRule}
                          onChange={(e) => setFormData({...formData, adjustmentRule: e.target.value})}
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveRule}>
                        {editingRule ? 'Update Rule' : 'Create Rule'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent value="all">
              {loading ? (
                <div className="text-center py-8 text-gray-600">Loading...</div>
              ) : rubricRules.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  No rubrics yet. Click "Generate Rubrics from Guidelines" to create them automatically.
                </div>
              ) : (
                <RubricTable 
                  rules={rubricRules} 
                  onEdit={handleEditRule}
                  onAccept={handleAcceptRule}
                  onReject={handleRejectRule}
                  onViewEvidence={handleViewEvidence}
                  getCriticalityColor={getCriticalityColor}
                  sessionId={sessionId}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isEvidenceDialogOpen} onOpenChange={setIsEvidenceDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Evidence for: {viewingEvidence?.errorType}</DialogTitle>
            <DialogDescription>
              Source quotes and page references supporting this rubric rule
            </DialogDescription>
          </DialogHeader>
          {viewingEvidence && (
            <div className="space-y-4 py-4">
              {viewingEvidence.category && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{viewingEvidence.category}</Badge>
                  <Badge variant={getCriticalityColor(viewingEvidence.criticality)}>
                    {viewingEvidence.criticality}
                  </Badge>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Definition:</p>
                <p className="text-sm text-gray-700">{viewingEvidence.description}</p>
              </div>

              {viewingEvidence.evidence && viewingEvidence.evidence.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Source Evidence:</p>
                  {viewingEvidence.evidence.map((ev, idx) => (
                    <div 
                      key={idx}
                      className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-yellow-800">
                          Page {ev.page}
                        </span>
                        {sessionId && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              window.open(
                                `${API_BASE}/document/${sessionId}#page=${ev.page}`,
                                'pdf-viewer',
                                'width=900,height=1000'
                              );
                            }}
                            className="h-6 text-xs"
                          >
                            View in Doc
                          </Button>
                        )}
                      </div>
                      <p className="text-sm italic text-gray-700">"{ev.quote}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-4">
                  No evidence links available
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={() => setIsEvidenceDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface RubricTableProps {
  rules: RubricRule[];
  onEdit: (rule: RubricRule) => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onViewEvidence: (rule: RubricRule) => void;
  getCriticalityColor: (criticality: string) => any;
  sessionId: string | null;
}

function RubricTable({ rules, onEdit, onAccept, onReject, onViewEvidence, getCriticalityColor }: RubricTableProps) {
  if (rules.length === 0) {
    return <div className="text-center py-8 text-gray-600">No rules in this category</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{width: '200px'}}>Error Type</TableHead>
            <TableHead style={{width: '300px'}}>Description</TableHead>
            <TableHead style={{width: '100px'}}>Criticality</TableHead>
            <TableHead style={{width: '80px'}}>Penalty</TableHead>
            <TableHead style={{width: '100px'}}>Evidence</TableHead>
            <TableHead style={{width: '280px'}}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell style={{verticalAlign: 'top'}}>
                <p className="font-medium" style={{wordWrap: 'break-word'}}>{rule.errorType}</p>
                {rule.category && (
                  <p className="text-xs text-gray-400 mt-1" style={{wordWrap: 'break-word'}}>{rule.category}</p>
                )}
              </TableCell>
              <TableCell style={{verticalAlign: 'top'}}>
                <p className="text-sm text-gray-500" style={{wordWrap: 'break-word', whiteSpace: 'normal'}}>
                  {rule.description}
                </p>
              </TableCell>
              <TableCell style={{verticalAlign: 'top'}}>
                <Badge variant={getCriticalityColor(rule.criticality)}>
                  {rule.criticality}
                </Badge>
              </TableCell>
              <TableCell style={{verticalAlign: 'top'}}>{rule.penalty}%</TableCell>
              <TableCell style={{verticalAlign: 'top'}}>
                {rule.evidence && rule.evidence.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewEvidence(rule)}
                  >
                    View ({rule.evidence.length})
                  </Button>
                )}
              </TableCell>
              <TableCell style={{verticalAlign: 'top'}}>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onEdit(rule)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => onAccept(rule.id)}
                  >
                    Accept
                  </Button>
                  <Button 
                    size="sm"
                    variant="destructive"
                    onClick={() => onReject(rule.id)}
                  >
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}