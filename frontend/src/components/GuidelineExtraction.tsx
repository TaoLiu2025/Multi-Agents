// import { useEffect, useMemo, useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
// import { Button } from './ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// import { Textarea } from './ui/textarea';
// import { Input } from './ui/input';
// import { Label } from './ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
// import { Progress } from './ui/progress';
// import { CheckCircle, Clock, AlertTriangle, FileText, Plus, Edit, Trash2, Play } from 'lucide-react';

// // import { useEffect, useState } from 'react';
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// // import { Badge } from './ui/badge';
// // import { Button } from './ui/button';
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// // import { Textarea } from './ui/textarea';
// // import { Input } from './ui/input';
// // import { Label } from './ui/label';
// // import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
// // import { Clock, AlertTriangle, Play, Edit, Trash2 } from 'lucide-react';

// const API_BASE = '/api';

// type HilStatus = 'pending' | 'accepted' | 'rejected' | 'edited';
// type GuidelineStatus = 'pending' | 'approved' | 'rejected' | 'edited';

// interface HilItem {
//   rule: string;
//   quote?: string;
//   page?: number;
//   status: HilStatus;
//   last_updated?: string | null;
// }

// // Grouped structure: { Group: { Category: [items] } }
// type HilData = Record<string, Record<string, HilItem[]>>;

// interface Guideline {
//   id: string;
//   group: string;
//   category: string;
//   criterion: string;
//   extractedText: string;
//   confidence: number;
//   status: GuidelineStatus;
//   quote?: string;
//   page?: number;
//   hilIndex?: number;
// }

// type Props = {
//   sessionId?: string | null;
//   onExtractionStarted?: () => void;
//   onExtractionComplete?: () => void;
// };

// export function GuidelineExtraction({ sessionId: sessionIdProp, onExtractionStarted, onExtractionComplete }: Props) {
//   const [sessionId, setSessionId] = useState<string | null>(sessionIdProp ?? null);
//   const [extracting, setExtracting] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [guidelines, setGuidelines] = useState<Guideline[]>([]);
//   const [groups, setGroups] = useState<string[]>([]);
//   const [activeGroup, setActiveGroup] = useState<string>('');

//   const [highlightedGuideline, setHighlightedGuideline] = useState<string | null>(null);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [editingGuideline, setEditingGuideline] = useState<Guideline | null>(null);

//   const hilToUiStatus = (s: HilStatus): GuidelineStatus =>
//     s === 'accepted' ? 'approved' : (s as GuidelineStatus);

//   const uiToHilStatus = (s: GuidelineStatus): HilStatus =>
//     s === 'approved' ? 'accepted' : (s as HilStatus);

//   const makeCriterion = (rule: string) => {
//     const first = (rule || '').split(/[.\n:]/)[0]?.trim() || 'Guideline';
//     return first.length > 80 ? first.slice(0, 77) + '...' : first;
//   };

//   const getStatusColor = (status: GuidelineStatus) => {
//     switch (status) {
//       case 'approved': return 'default';
//       case 'rejected': return 'destructive';
//       case 'edited': return 'secondary';
//       default: return 'outline';
//     }
//   };

//   const getConfidenceColor = (confidence: number) => {
//     if (confidence >= 90) return 'text-green-600';
//     if (confidence >= 75) return 'text-yellow-600';
//     return 'text-red-600';
//   };

//   const gridColsClass = (n: number) => {
//     if (n <= 1) return 'grid-cols-1';
//     if (n === 2) return 'grid-cols-2';
//     if (n === 3) return 'grid-cols-3';
//     if (n === 4) return 'grid-cols-4';
//     if (n === 5) return 'grid-cols-5';
//     return 'grid-cols-6';
//   };

//   async function apiExtract(sid: string) {
//     const res = await fetch(`${API_BASE}/extract/${sid}`, { method: 'POST' });
//     if (!res.ok) {
//       const body = await res.json().catch(() => ({}));
//       throw new Error(body.detail || `Extract failed: ${res.status}`);
//     }
//     return res.json();
//   }

//   async function apiGetHIL(sid: string): Promise<{ hil_data: HilData }> {
//     const res = await fetch(`${API_BASE}/hil/${sid}`);
//     if (!res.ok) {
//       const body = await res.json().catch(() => ({}));
//       throw new Error(body.detail || `Fetch HIL failed: ${res.status}`);
//     }
//     return res.json();
//   }

//   async function apiUpdateHIL(sid: string, group: string, category: string, index: number, patch: Partial<HilItem>) {
//     const res = await fetch(`${API_BASE}/hil/${sid}/update`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ group, category, index, patch })
//     });
//     if (!res.ok) {
//       const body = await res.json().catch(() => ({}));
//       throw new Error(body.detail || `Update HIL failed: ${res.status}`);
//     }
//     return res.json();
//   }

//   function mapHilToGuidelines(hil: HilData): { rows: Guideline[]; groupNames: string[] } {
//     const rows: Guideline[] = [];
//     const groupNames = Object.keys(hil);

//     for (const group of groupNames) {
//       const categories = hil[group] || {};
//       for (const category of Object.keys(categories)) {
//         const items = categories[category] || [];
//         items.forEach((it, idx) => {
//           rows.push({
//             id: `${group}:${category}:${idx}`,
//             group,
//             category,
//             criterion: makeCriterion(it.rule),
//             extractedText: it.rule || '',
//             quote: it.quote,
//             page: it.page,
//             confidence: 90,
//             status: hilToUiStatus(it.status || 'pending'),
//             hilIndex: idx
//           });
//         });
//       }
//     }

//     return { rows, groupNames };
//   }

//   const loadHil = async () => {
//     if (!sessionId) return;
//     setLoading(true);
//     setError(null);

//     try {
//       const { hil_data } = await apiGetHIL(sessionId);
      
//       if (!hil_data || Object.keys(hil_data).length === 0) {
//         setGuidelines([]);
//         setGroups([]);
//         setError('No data extracted yet. Click "Start Extraction" to process the document.');
//         return;
//       }

//       const { rows, groupNames } = mapHilToGuidelines(hil_data);
//       setGuidelines(rows);
//       setGroups(groupNames);

//       const firstGroup = groupNames[0] || '';
//       setActiveGroup((prev) => prev || firstGroup);
//     } catch (e: any) {
//       setError(e.message || 'Failed to fetch HIL');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStartExtraction = async () => {
//     if (!sessionId) {
//       setError('Please upload a document first.');
//       return;
//     }
//     setError(null);
//     setExtracting(true);
//     onExtractionStarted?.();

//     try {
//       await apiExtract(sessionId);
//       await loadHil();
//       onExtractionComplete?.();
//     } catch (e: any) {
//       setError(e.message || 'Extraction failed');
//     } finally {
//       setExtracting(false);
//     }
//   };

//   const handleStatusChange = async (g: Guideline, newStatus: GuidelineStatus) => {
//     if (!sessionId || g.hilIndex == null) return;
//     const prev = g.status;
//     setGuidelines((list) => list.map((x) => (x.id === g.id ? { ...x, status: newStatus } : x)));
//     try {
//       await apiUpdateHIL(sessionId, g.group, g.category, g.hilIndex, { status: uiToHilStatus(newStatus) });
//     } catch (e) {
//       setGuidelines((list) => list.map((x) => (x.id === g.id ? { ...x, status: prev } : x)));
//       console.error(e);
//     }
//   };

//   const handleLocalEdit = (g: Guideline, newText: string) => {
//     setGuidelines((list) => list.map((x) => (x.id === g.id ? { ...x, extractedText: newText, status: 'edited' } : x)));
//   };

//   const handlePersistEdit = async (g: Guideline) => {
//     if (!sessionId || g.hilIndex == null) return;
//     try {
//       await apiUpdateHIL(sessionId, g.group, g.category, g.hilIndex, { rule: g.extractedText, status: 'edited' });
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const handleEditGuideline = (g: Guideline) => {
//     setEditingGuideline(g);
//     setIsEditDialogOpen(true);
//   };

//   const handleUpdateGuideline = async () => {
//     if (!editingGuideline) return;
//     handleLocalEdit(editingGuideline, editingGuideline.extractedText);
//     await handlePersistEdit(editingGuideline);
//     setIsEditDialogOpen(false);
//   };

//   const handleDeleteGuideline = (id: string) => {
//     setGuidelines((list) => list.filter((x) => x.id !== id));
//   };

//   const handleGuidelineClick = (id: string) => {
//     setHighlightedGuideline((prev) => (prev === id ? null : id));
//   };

//   useEffect(() => {
//     if (!sessionIdProp) {
//       const sid = localStorage.getItem('sessionId');
//       if (sid) setSessionId(sid);
//     }
//   }, [sessionIdProp]);

//   useEffect(() => {
//     if (sessionId) loadHil();
//   }, [sessionId]);

//   // Get categories for the active group
//   const activeCategories = [...new Set(
//     guidelines.filter(g => g.group === activeGroup).map(g => g.category)
//   )];

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center space-x-2">
//             <Play className="w-5 h-5" />
//             <span>Extraction</span>
//           </CardTitle>
//           <CardDescription>
//             Start extraction for the uploaded document, then review items below.
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="flex items-center gap-3 flex-wrap">
//           <Button onClick={handleStartExtraction} disabled={!sessionId || extracting}>
//             <Play className="w-4 h-4 mr-2" />
//             {extracting ? 'Extracting...' : 'Start Extraction'}
//           </Button>
//           <Button variant="outline" onClick={loadHil} disabled={!sessionId || loading || extracting}>
//             Refresh
//           </Button>

//           {sessionId ? (
//             <span className="text-xs text-gray-500">Session: {sessionId.slice(0, 8)}...</span>
//           ) : (
//             <span className="text-xs text-red-600">No session — upload a document first</span>
//           )}

//           {loading && (
//             <div className="flex items-center gap-2 text-sm text-gray-600">
//               <Clock className="w-4 h-4" /> Loading...
//             </div>
//           )}
//           {error && <div className="text-sm text-red-600">{error}</div>}
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Human-in-the-Loop Review</CardTitle>
//           <CardDescription>
//             Review, validate, and edit extracted guidelines organized by group and category.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {groups.length === 0 ? (
//             <div className="text-sm text-gray-600">
//               No extracted items yet. Click <strong>Start Extraction</strong> above.
//             </div>
//           ) : (
//             <Tabs
//               value={activeGroup || (groups[0] ?? '')}
//               onValueChange={(v: string) => setActiveGroup(v)}
//               className="w-full"
//             >
//               <TabsList className={`grid w-full ${gridColsClass(groups.length)}`}>
//                 {groups.map((grp) => (
//                   <TabsTrigger key={grp} value={grp} className="text-xs">
//                     {grp.replace(/_/g, ' ')}
//                   </TabsTrigger>
//                 ))}
//               </TabsList>

//               {groups.map((group) => (
//                 <TabsContent key={group} value={group} className="space-y-6 mt-6">
//                   {activeCategories.map((category) => (
//                     <div key={category} className="space-y-3">
//                       <h3 className="text-lg font-semibold border-b pb-2">
//                         {category.replace(/_/g, ' ')}
//                       </h3>
                      
//                       {guidelines
//                         .filter((g) => g.group === group && g.category === category)
//                         .map((g) => (
//                           <Card
//                             key={g.id}
//                             className={`cursor-pointer transition-colors ${
//                               highlightedGuideline === g.id
//                                 ? 'border-yellow-500 bg-yellow-50'
//                                 : 'hover:bg-gray-50'
//                             }`}
//                             onClick={() => handleGuidelineClick(g.id)}
//                           >
//                             <CardContent className="p-4">
//                               <div className="flex items-start justify-between mb-3">
//                                 <div className="flex-1">
//                                   <h4 className="font-medium">{g.criterion}</h4>
//                                   <p className="text-sm text-gray-500">
//                                     Confidence:{' '}
//                                     <span className={getConfidenceColor(g.confidence)}>
//                                       {g.confidence}%
//                                     </span>
//                                     {g.page && (
//                                       <span className="ml-2 text-gray-400">· Page {g.page}</span>
//                                     )}
//                                   </p>
//                                 </div>
//                                 <div className="flex items-center space-x-2">
//                                   <Badge variant={getStatusColor(g.status)}>{g.status}</Badge>
//                                   {g.category.toLowerCase().includes('recommendation') && (
//                                     <Badge variant="outline">
//                                       <AlertTriangle className="w-3 h-3 mr-1" />
//                                       LLM Generated
//                                     </Badge>
//                                   )}
//                                   {g.quote && (
//                                     <Badge variant="secondary" className="text-xs">
//                                       Has quote
//                                     </Badge>
//                                   )}
//                                 </div>
//                               </div>

//                               <Textarea
//                                 value={g.extractedText}
//                                 onChange={(e) => handleLocalEdit(g, e.target.value)}
//                                 onBlur={() => handlePersistEdit(g)}
//                                 onClick={(e) => e.stopPropagation()}
//                                 className="mb-3"
//                                 rows={3}
//                               />

//                               {g.quote && highlightedGuideline === g.id && (
//                                 <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
//                                   <strong>Source Quote:</strong> {g.quote}
//                                 </div>
//                               )}

//                               <div className="flex items-center justify-end space-x-2">
//                                 {g.quote && (
//                                   <Button
//                                     size="sm"
//                                     variant="outline"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       const pdfUrl = `${API_BASE}/document/${sessionId}`;
//                                       const searchText = g.quote?.substring(0, 100) || ''; // First 100 chars for search
//                                       const pdfWindow = window.open('', 'pdf-viewer', 'width=1000,height=1000');
//                                       if (pdfWindow) {
//                                         pdfWindow.document.write(`
//                                           <!DOCTYPE html>
//                                           <html>
//                                             <head>
//                                               <title>Document Viewer</title>
//                                               <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
//                                               <style>
//                                                 * { margin: 0; padding: 0; box-sizing: border-box; }
//                                                 body { font-family: system-ui; background: #f5f5f5; }
//                                                 .header { background: #fef3c7; border-bottom: 2px solid #fbbf24; padding: 16px; }
//                                                 .quote { background: white; padding: 12px; margin-top: 8px; border-left: 3px solid #fbbf24; font-size: 14px; line-height: 1.6; max-height: 100px; overflow-y: auto; }
//                                                 .controls { background: white; padding: 12px; border-bottom: 1px solid #ddd; display: flex; gap: 8px; align-items: center; justify-content: center; }
//                                                 .btn { padding: 6px 12px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-size: 14px; }
//                                                 .btn:hover { background: #f9fafb; }
//                                                 #pdf-container { padding: 20px; text-align: center; overflow-y: auto; height: calc(100vh - 200px); }
//                                                 .pdf-page { margin: 0 auto 20px; position: relative; display: inline-block; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
//                                                 canvas { display: block; }
//                                                 .textLayer { position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; opacity: 0.2; line-height: 1.0; }
//                                                 .textLayer > span { color: transparent; position: absolute; white-space: pre; cursor: text; transform-origin: 0% 0%; }
//                                                 .textLayer .highlight { background-color: #fbbf24; opacity: 0.6; }
//                                                 .status { padding: 8px; text-align: center; font-size: 13px; color: #666; }
//                                               </style>
//                                             </head>
//                                             <body>
//                                               <div class="header">
//                                                 <strong>Source Quote:</strong>
//                                                 <div class="quote">"${g.quote?.replace(/"/g, '&quot;')}"</div>
//                                               </div>
//                                               <div class="controls">
//                                                 <button class="btn" id="prev">← Previous</button>
//                                                 <span id="page-info">Page 1 of 1</span>
//                                                 <button class="btn" id="next">Next →</button>
//                                                 <button class="btn" id="find-quote">🔍 Find & Highlight</button>
//                                               </div>
//                                               <div class="status" id="status">Loading PDF...</div>
//                                               <div id="pdf-container"></div>
                                              
//                                               <script>
//                                                 pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                                                
//                                                 let pdfDoc = null;
//                                                 let currentPage = 1;
//                                                 let scale = 1.5;
//                                                 const searchText = "${searchText.replace(/"/g, '\\"')}".toLowerCase();
                                                
//                                                 async function renderPage(pageNum) {
//                                                   const page = await pdfDoc.getPage(pageNum);
//                                                   const viewport = page.getViewport({ scale });
                                                  
//                                                   const pageDiv = document.createElement('div');
//                                                   pageDiv.className = 'pdf-page';
//                                                   pageDiv.style.width = viewport.width + 'px';
//                                                   pageDiv.style.height = viewport.height + 'px';
                                                  
//                                                   const canvas = document.createElement('canvas');
//                                                   const ctx = canvas.getContext('2d');
//                                                   canvas.height = viewport.height;
//                                                   canvas.width = viewport.width;
//                                                   pageDiv.appendChild(canvas);
                                                  
//                                                   await page.render({ canvasContext: ctx, viewport }).promise;
                                                  
//                                                   const textContent = await page.getTextContent();
//                                                   const textLayer = document.createElement('div');
//                                                   textLayer.className = 'textLayer';
//                                                   pageDiv.appendChild(textLayer);
                                                  
//                                                   pdfjsLib.renderTextLayer({
//                                                     textContent,
//                                                     container: textLayer,
//                                                     viewport,
//                                                     textDivs: []
//                                                   });
                                                  
//                                                   return { pageDiv, textLayer, textContent };
//                                                 }
                                                
//                                                 async function loadAllPages() {
//                                                   const container = document.getElementById('pdf-container');
//                                                   container.innerHTML = '';
                                                  
//                                                   for (let i = 1; i <= pdfDoc.numPages; i++) {
//                                                     const { pageDiv } = await renderPage(i);
//                                                     container.appendChild(pageDiv);
//                                                   }
                                                  
//                                                   document.getElementById('status').textContent = 'PDF loaded. Click "Find & Highlight" to locate the quote.';
//                                                 }
                                                
//                                                 function highlightText() {
//                                                   const textLayers = document.querySelectorAll('.textLayer');
//                                                   let found = false;
                                                  
//                                                   textLayers.forEach(layer => {
//                                                     const spans = layer.querySelectorAll('span');
//                                                     spans.forEach(span => {
//                                                       if (span.textContent.toLowerCase().includes(searchText.substring(0, 30))) {
//                                                         span.classList.add('highlight');
//                                                         if (!found) {
//                                                           span.scrollIntoView({ behavior: 'smooth', block: 'center' });
//                                                           found = true;
//                                                         }
//                                                       }
//                                                     });
//                                                   });
                                                  
//                                                   if (found) {
//                                                     document.getElementById('status').textContent = '✓ Quote highlighted in yellow';
//                                                   } else {
//                                                     document.getElementById('status').textContent = '⚠ Quote text not found in PDF';
//                                                   }
//                                                 }
                                                
//                                                 pdfjsLib.getDocument('${pdfUrl}').promise.then(async pdf => {
//                                                   pdfDoc = pdf;
//                                                   document.getElementById('page-info').textContent = \`Page 1 of \${pdf.numPages}\`;
//                                                   await loadAllPages();
//                                                 });
                                                
//                                                 document.getElementById('find-quote').onclick = highlightText;
//                                               </script>
//                                             </body>
//                                           </html>
//                                         `);
//                                         pdfWindow.document.close();
//                                       }
//                                     }}
//                                   >
//                                     View Source
//                                   </Button>
//                                 )}
//                                 <Button
//                                   size="sm"
//                                   variant="outline"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleEditGuideline(g);
//                                   }}
//                                 >
//                                   <Edit className="w-3 h-3 mr-1" />
//                                   Edit
//                                 </Button>
//                                 <Button
//                                   size="sm"
//                                   variant="destructive"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleStatusChange(g, 'rejected');
//                                     handleDeleteGuideline(g.id);
//                                   }}
//                                 >
//                                   <Trash2 className="w-3 h-3 mr-1" />
//                                   Reject
//                                 </Button>
//                                 <Button
//                                   size="sm"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleStatusChange(g, 'approved');
//                                   }}
//                                 >
//                                   Approve
//                                 </Button>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         ))}
//                     </div>
//                   ))}
//                 </TabsContent>
//               ))}
//             </Tabs>
//           )}
//         </CardContent>
//       </Card>

//       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//         <DialogContent className="sm:max-w-[600px]">
//           <DialogHeader>
//             <DialogTitle>Edit Guideline</DialogTitle>
//             <DialogDescription>Modify the guideline details</DialogDescription>
//           </DialogHeader>
//           {editingGuideline && (
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label className="text-right">Group</Label>
//                 <Input value={editingGuideline.group} disabled className="col-span-3" />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label className="text-right">Category</Label>
//                 <Input value={editingGuideline.category} disabled className="col-span-3" />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="edit-extractedText" className="text-right">
//                   Guideline Text
//                 </Label>
//                 <Textarea
//                   id="edit-extractedText"
//                   value={editingGuideline.extractedText}
//                   onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
//                     setEditingGuideline({ ...editingGuideline, extractedText: e.target.value })
//                   }
//                   className="col-span-3"
//                   rows={4}
//                 />
//               </div>
//             </div>
//           )}
//           <div className="flex justify-end space-x-2">
//             <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleUpdateGuideline}>Update Guideline</Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export default GuidelineExtraction;

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { CheckCircle, Clock, AlertTriangle, FileText, Plus, Edit, Trash2, Play, Download } from 'lucide-react';

const API_BASE = '/api';

type HilStatus = 'pending' | 'accepted' | 'rejected' | 'edited';
type GuidelineStatus = 'pending' | 'approved' | 'rejected' | 'edited';

interface HilItem {
  rule: string;
  quote?: string;
  page?: number;
  status: HilStatus;
  last_updated?: string | null;
}

type HilData = Record<string, Record<string, HilItem[]>>;

interface Guideline {
  id: string;
  group: string;
  category: string;
  criterion: string;
  extractedText: string;
  confidence: number;
  status: GuidelineStatus;
  quote?: string;
  page?: number;
  hilIndex?: number;
}

type Props = {
  sessionId?: string | null;
  onExtractionStarted?: () => void;
  onExtractionComplete?: () => void;
};

export function GuidelineExtraction({ sessionId: sessionIdProp, onExtractionStarted, onExtractionComplete }: Props) {
  const [sessionId, setSessionId] = useState<string | null>(sessionIdProp ?? null);
  const [extracting, setExtracting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [activeGroup, setActiveGroup] = useState<string>('');

  const [highlightedGuideline, setHighlightedGuideline] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingGuideline, setEditingGuideline] = useState<Guideline | null>(null);

  const hilToUiStatus = (s: HilStatus): GuidelineStatus =>
    s === 'accepted' ? 'approved' : (s as GuidelineStatus);

  const uiToHilStatus = (s: GuidelineStatus): HilStatus =>
    s === 'approved' ? 'accepted' : (s as HilStatus);

  const makeCriterion = (rule: string) => {
    const first = (rule || '').split(/[.\n:]/)[0]?.trim() || 'Guideline';
    return first.length > 80 ? first.slice(0, 77) + '...' : first;
  };

  const getStatusColor = (status: GuidelineStatus) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'edited': return 'secondary';
      default: return 'outline';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const gridColsClass = (n: number) => {
    if (n <= 1) return 'grid-cols-1';
    if (n === 2) return 'grid-cols-2';
    if (n === 3) return 'grid-cols-3';
    if (n === 4) return 'grid-cols-4';
    if (n === 5) return 'grid-cols-5';
    return 'grid-cols-6';
  };

  async function apiExtract(sid: string) {
    const res = await fetch(`${API_BASE}/extract/${sid}`, { method: 'POST' });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail || `Extract failed: ${res.status}`);
    }
    return res.json();
  }

  async function apiGetHIL(sid: string): Promise<{ hil_data: HilData }> {
    const res = await fetch(`${API_BASE}/hil/${sid}`);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail || `Fetch HIL failed: ${res.status}`);
    }
    return res.json();
  }

  async function apiUpdateHIL(sid: string, group: string, category: string, index: number, patch: Partial<HilItem>) {
    const res = await fetch(`${API_BASE}/hil/${sid}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ group, category, index, patch })
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.detail || `Update HIL failed: ${res.status}`);
    }
    return res.json();
  }

  function mapHilToGuidelines(hil: HilData): { rows: Guideline[]; groupNames: string[] } {
    const rows: Guideline[] = [];
    const groupNames = Object.keys(hil);

    for (const group of groupNames) {
      const categories = hil[group] || {};
      for (const category of Object.keys(categories)) {
        const items = categories[category] || [];
        items.forEach((it, idx) => {
          rows.push({
            id: `${group}:${category}:${idx}`,
            group,
            category,
            criterion: makeCriterion(it.rule),
            extractedText: it.rule || '',
            quote: it.quote,
            page: it.page,
            confidence: 90,
            status: hilToUiStatus(it.status || 'pending'),
            hilIndex: idx
          });
        });
      }
    }

    return { rows, groupNames };
  }

  const loadHil = async () => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);

    try {
      const { hil_data } = await apiGetHIL(sessionId);
      
      if (!hil_data || Object.keys(hil_data).length === 0) {
        setGuidelines([]);
        setGroups([]);
        setError('No data extracted yet. Click "Start Extraction" to process the document.');
        return;
      }

      const { rows, groupNames } = mapHilToGuidelines(hil_data);
      setGuidelines(rows);
      setGroups(groupNames);

      const firstGroup = groupNames[0] || '';
      setActiveGroup((prev) => prev || firstGroup);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch HIL');
    } finally {
      setLoading(false);
    }
  };

  const handleStartExtraction = async () => {
    if (!sessionId) {
      setError('Please upload a document first.');
      return;
    }
    setError(null);
    setExtracting(true);
    onExtractionStarted?.();
    
    try {
      await apiExtract(sessionId);
      await loadHil();
      onExtractionComplete?.();
    } catch (e: any) {
      setError(e.message || 'Extraction failed');
    } finally {
      setExtracting(false);
    }
  };

  const handleStatusChange = async (g: Guideline, newStatus: GuidelineStatus) => {
    if (!sessionId || g.hilIndex == null) return;
    const prev = g.status;
    setGuidelines((list) => list.map((x) => (x.id === g.id ? { ...x, status: newStatus } : x)));
    try {
      await apiUpdateHIL(sessionId, g.group, g.category, g.hilIndex, { status: uiToHilStatus(newStatus) });
    } catch (e) {
      setGuidelines((list) => list.map((x) => (x.id === g.id ? { ...x, status: prev } : x)));
      console.error(e);
    }
  };

  const handleLocalEdit = (g: Guideline, newText: string) => {
    setGuidelines((list) => list.map((x) => (x.id === g.id ? { ...x, extractedText: newText, status: 'edited' } : x)));
  };

  const handlePersistEdit = async (g: Guideline) => {
    if (!sessionId || g.hilIndex == null) return;
    try {
      await apiUpdateHIL(sessionId, g.group, g.category, g.hilIndex, { rule: g.extractedText, status: 'edited' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditGuideline = (g: Guideline) => {
    setEditingGuideline(g);
    setIsEditDialogOpen(true);
  };

  const handleUpdateGuideline = async () => {
    if (!editingGuideline) return;
    handleLocalEdit(editingGuideline, editingGuideline.extractedText);
    await handlePersistEdit(editingGuideline);
    setIsEditDialogOpen(false);
  };

  const handleDeleteGuideline = (id: string) => {
    setGuidelines((list) => list.filter((x) => x.id !== id));
  };

  const handleGuidelineClick = (id: string) => {
    setHighlightedGuideline((prev) => (prev === id ? null : id));
  };

  const handleDownloadGuidelines = () => {
    // Filter only approved and edited guidelines (exclude rejected and pending)
    const approvedGuidelines = guidelines.filter(
      g => g.status === 'approved' || g.status === 'edited'
    );

    // Build the structured output
    const output: Record<string, Record<string, Array<{ rule: string }>>> = {};

    approvedGuidelines.forEach(g => {
      // Initialize group if not exists
      if (!output[g.group]) {
        output[g.group] = {};
      }

      // Initialize category if not exists
      if (!output[g.group][g.category]) {
        output[g.group][g.category] = [];
      }

      // Add the rule
      output[g.group][g.category].push({
        rule: g.extractedText
      });
    });

    // Add "none" for empty categories within existing groups
    for (const group of groups) {
      if (output[group]) {
        const categoriesInGroup = new Set(
          guidelines
            .filter(g => g.group === group)
            .map(g => g.category)
        );
        
        categoriesInGroup.forEach(cat => {
          if (!output[group][cat] || output[group][cat].length === 0) {
            output[group][cat] = ["none" as any];
          }
        });
      }
    }

    // Create and download the JSON file
    const blob = new Blob([JSON.stringify(output, null, 4)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `guidelines_${sessionId?.slice(0, 8) || 'export'}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleApproveAllPendingInActiveGroup = async () => {
    if (!sessionId || !activeGroup) return;
    const pendingInGroup = guidelines.filter(
      (g) => g.group === activeGroup && g.status === 'pending' && g.hilIndex != null
    );
    if (pendingInGroup.length === 0) return;

    // Optimistically update UI
    const idsToApprove = new Set(pendingInGroup.map((g) => g.id));
    setGuidelines((list) => list.map((x) => (idsToApprove.has(x.id) ? { ...x, status: 'approved' } : x)));

    // Persist each update
    try {
      await Promise.all(
        pendingInGroup.map((g) =>
          apiUpdateHIL(sessionId, g.group, g.category, g.hilIndex as number, { status: uiToHilStatus('approved') })
        )
      );
    } catch (e) {
      // On error, reload current data to resync
      await loadHil();
    }
  };

  useEffect(() => {
    if (!sessionIdProp) {
      const sid = localStorage.getItem('sessionId');
      if (sid) setSessionId(sid);
    }
  }, [sessionIdProp]);

  useEffect(() => {
    if (sessionId) loadHil();
  }, [sessionId]);

  const activeCategories = [...new Set(
    guidelines.filter(g => g.group === activeGroup).map(g => g.category)
  )];

  // Count approved/edited guidelines for download button
  const reviewedCount = guidelines.filter(
    g => g.status === 'approved' || g.status === 'edited'
  ).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="w-5 h-5" />
            <span>Extraction</span>
          </CardTitle>
          <CardDescription>
            Start extraction for the uploaded document, then review items below.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-3 flex-wrap">
          <Button onClick={handleStartExtraction} disabled={!sessionId || extracting}>
            <Play className="w-4 h-4 mr-2" />
            {extracting ? 'Extracting...' : 'Start Extraction'}
          </Button>
          {/* <Button variant="outline" onClick={loadHil} disabled={!sessionId || loading || extracting}>
            Refresh
          </Button> */}
          
          <Button 
            variant="outline"
            onClick={handleDownloadGuidelines}
            disabled={reviewedCount === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Guidelines ({reviewedCount})
          </Button>

          {sessionId ? (
            <span className="text-xs text-gray-500"></span>
          ) : (
            <span className="text-xs text-red-600">No session — upload a document first</span>
          )}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" /> Loading...
            </div>
          )}
          {error && <div className="text-sm text-red-600">{error}</div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
          <CardTitle>Human-in-the-Loop Review</CardTitle>
          <CardDescription>
            Review, validate, and edit extracted guidelines organized by group and category.
          </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleApproveAllPendingInActiveGroup}
                variant="outline"
                disabled={!activeGroup || guidelines.filter(g => g.group === activeGroup && g.status === 'pending').length === 0}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve All Pending
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {groups.length === 0 ? (
            <div className="text-sm text-gray-600">
              No extracted items yet. Click <strong>Start Extraction</strong> above.
            </div>
          ) : (
            <Tabs
              value={activeGroup || (groups[0] ?? '')}
              onValueChange={(v: string) => setActiveGroup(v)}
              className="w-full"
            >
              <TabsList className={`grid w-full ${gridColsClass(groups.length)}`}>
                {groups.map((grp) => (
                  <TabsTrigger key={grp} value={grp} className="text-xs">
                    {grp.replace(/_/g, ' ')}
                  </TabsTrigger>
                ))}
              </TabsList>

              {groups.map((group) => (
                <TabsContent key={group} value={group} className="space-y-6 mt-6">
                  {activeCategories.map((category) => (
                    <div key={category} className="space-y-3">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        {category.replace(/_/g, ' ')}
                      </h3>
                      
                      {guidelines
                        .filter((g) => g.group === group && g.category === category)
                        .map((g) => (
                          <Card
                            key={g.id}
                            className={`cursor-pointer transition-colors ${
                              highlightedGuideline === g.id
                                ? 'border-yellow-500 bg-yellow-50'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => handleGuidelineClick(g.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-medium">{g.criterion}</h4>
                                  {/* <p className="text-sm text-gray-500">
                                    Confidence:{' '} */}
                                    {/* <span className={getConfidenceColor(g.confidence)}>
                                      {g.confidence}%
                                    </span> */}
                                    {/* {g.page && (
                                      <span className="ml-2 text-gray-400">· Page {g.page}</span>
                                    )} */}
                                  {/* </p> */}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant={getStatusColor(g.status)}>{g.status}</Badge>
                                  {g.category.toLowerCase().includes('recommendation') && (
                                    <Badge variant="outline">
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      LLM Generated
                                    </Badge>
                                  )}
                                  {g.quote && (
                                    <Badge variant="secondary" className="text-xs">
                                      Has quote
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <Textarea
                                value={g.extractedText}
                                onChange={(e) => handleLocalEdit(g, e.target.value)}
                                onBlur={() => handlePersistEdit(g)}
                                onClick={(e) => e.stopPropagation()}
                                className="mb-3"
                                rows={3}
                              />

                              {g.quote && highlightedGuideline === g.id && (
                                <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                                  <strong>Source Quote:</strong> {g.quote}
                                </div>
                              )}

                              <div className="flex items-center justify-end space-x-2">
                                {g.quote && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const pdfUrl = `${API_BASE}/document/${sessionId}`;
                                      const searchText = g.quote?.substring(0, 100) || '';
                                      const pdfWindow = window.open('', 'pdf-viewer', 'width=1000,height=1000');
                                      if (pdfWindow) {
                                        pdfWindow.document.write(`
                                          <!DOCTYPE html>
                                          <html>
                                            <head>
                                              <title>Document Viewer</title>
                                              <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
                                              <style>
                                                * { margin: 0; padding: 0; box-sizing: border-box; }
                                                body { font-family: system-ui; background: #f5f5f5; }
                                                .header { background: #fef3c7; border-bottom: 2px solid #fbbf24; padding: 16px; }
                                                .quote { background: white; padding: 12px; margin-top: 8px; border-left: 3px solid #fbbf24; font-size: 14px; line-height: 1.6; max-height: 100px; overflow-y: auto; }
                                                .controls { background: white; padding: 12px; border-bottom: 1px solid #ddd; display: flex; gap: 8px; align-items: center; justify-content: center; }
                                                .btn { padding: 6px 12px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; font-size: 14px; }
                                                .btn:hover { background: #f9fafb; }
                                                #pdf-container { padding: 20px; text-align: center; overflow-y: auto; height: calc(100vh - 200px); }
                                                .pdf-page { margin: 0 auto 20px; position: relative; display: inline-block; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                                                canvas { display: block; }
                                                .textLayer { position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; opacity: 0.2; line-height: 1.0; }
                                                .textLayer > span { color: transparent; position: absolute; white-space: pre; cursor: text; transform-origin: 0% 0%; }
                                                .textLayer .highlight { background-color: #fbbf24; opacity: 0.6; }
                                                .status { padding: 8px; text-align: center; font-size: 13px; color: #666; }
                                              </style>
                                            </head>
                                            <body>
                                              <div class="header">
                                                <strong>Source Quote:</strong>
                                                <div class="quote">"${g.quote?.replace(/"/g, '&quot;')}"</div>
                                              </div>
                                              <div class="controls">
                                                <button class="btn" id="prev">← Previous</button>
                                                <span id="page-info">Page 1 of 1</span>
                                                <button class="btn" id="next">Next →</button>
                                                <button class="btn" id="find-quote">🔍 Find & Highlight</button>
                                              </div>
                                              <div class="status" id="status">Loading PDF...</div>
                                              <div id="pdf-container"></div>
                                              
                                              <script>
                                                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                                                
                                                let pdfDoc = null;
                                                let currentPage = 1;
                                                let scale = 1.5;
                                                const searchText = "${searchText.replace(/"/g, '\\"')}".toLowerCase();
                                                
                                                async function renderPage(pageNum) {
                                                  const page = await pdfDoc.getPage(pageNum);
                                                  const viewport = page.getViewport({ scale });
                                                  
                                                  const pageDiv = document.createElement('div');
                                                  pageDiv.className = 'pdf-page';
                                                  pageDiv.style.width = viewport.width + 'px';
                                                  pageDiv.style.height = viewport.height + 'px';
                                                  
                                                  const canvas = document.createElement('canvas');
                                                  const ctx = canvas.getContext('2d');
                                                  canvas.height = viewport.height;
                                                  canvas.width = viewport.width;
                                                  pageDiv.appendChild(canvas);
                                                  
                                                  await page.render({ canvasContext: ctx, viewport }).promise;
                                                  
                                                  const textContent = await page.getTextContent();
                                                  const textLayer = document.createElement('div');
                                                  textLayer.className = 'textLayer';
                                                  pageDiv.appendChild(textLayer);
                                                  
                                                  pdfjsLib.renderTextLayer({
                                                    textContent,
                                                    container: textLayer,
                                                    viewport,
                                                    textDivs: []
                                                  });
                                                  
                                                  return { pageDiv, textLayer, textContent };
                                                }
                                                
                                                async function loadAllPages() {
                                                  const container = document.getElementById('pdf-container');
                                                  container.innerHTML = '';
                                                  
                                                  for (let i = 1; i <= pdfDoc.numPages; i++) {
                                                    const { pageDiv } = await renderPage(i);
                                                    container.appendChild(pageDiv);
                                                  }
                                                  
                                                  document.getElementById('status').textContent = 'PDF loaded. Click "Find & Highlight" to locate the quote.';
                                                }
                                                
                                                function highlightText() {
                                                  const textLayers = document.querySelectorAll('.textLayer');
                                                  let found = false;
                                                  
                                                  textLayers.forEach(layer => {
                                                    const spans = layer.querySelectorAll('span');
                                                    spans.forEach(span => {
                                                      if (span.textContent.toLowerCase().includes(searchText.substring(0, 30))) {
                                                        span.classList.add('highlight');
                                                        if (!found) {
                                                          span.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                          found = true;
                                                        }
                                                      }
                                                    });
                                                  });
                                                  
                                                  if (found) {
                                                    document.getElementById('status').textContent = '✓ Quote highlighted in yellow';
                                                  } else {
                                                    document.getElementById('status').textContent = '⚠ Quote text not found in PDF';
                                                  }
                                                }
                                                
                                                pdfjsLib.getDocument('${pdfUrl}').promise.then(async pdf => {
                                                  pdfDoc = pdf;
                                                  document.getElementById('page-info').textContent = \`Page 1 of \${pdf.numPages}\`;
                                                  await loadAllPages();
                                                });
                                                
                                                document.getElementById('find-quote').onclick = highlightText;
                                              </script>
                                            </body>
                                          </html>
                                        `);
                                        pdfWindow.document.close();
                                      }
                                    }}
                                  >
                                    View Source
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditGuideline(g);
                                  }}
                                >
                                  <Edit className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(g, 'rejected');
                                    handleDeleteGuideline(g.id);
                                  }}
                                >
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(g, 'approved');
                                  }}
                                >
                                  Approve
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Guideline</DialogTitle>
            <DialogDescription>Modify the guideline details</DialogDescription>
          </DialogHeader>
          {editingGuideline && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Group</Label>
                <Input value={editingGuideline.group} disabled className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Category</Label>
                <Input value={editingGuideline.category} disabled className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-extractedText" className="text-right">
                  Guideline Text
                </Label>
                <Textarea
                  id="edit-extractedText"
                  value={editingGuideline.extractedText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setEditingGuideline({ ...editingGuideline, extractedText: e.target.value })
                  }
                  className="col-span-3"
                  rows={4}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateGuideline}>Update Guideline</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GuidelineExtraction;