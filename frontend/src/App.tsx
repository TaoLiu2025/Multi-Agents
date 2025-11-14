// import React, { useState, useEffect } from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
// import { Badge } from './components/ui/badge';
// import { 
//   Upload, 
//   Brain, 
//   Target, 
//   Workflow, 
//   BarChart3, 
//   FileText,
//   CheckCircle,
//   Clock
// } from 'lucide-react';

// import { DocumentUpload } from './components/DocumentUpload';
// import { GuidelineExtraction } from './components/GuidelineExtraction';
// import { QARubricManagement } from './components/QARubricManagement';
// import { WorkflowManagement } from './components/WorkflowManagement';
// import { QualityDashboard } from './components/QualityDashboard';
// import { QualityAgentResults } from './components/QualityAgentResults';

// export default function App() {
//   const [activeTab, setActiveTab] = useState('upload');
//   const [sessionId, setSessionId] = useState<string | null>(null);
//   const [extractionComplete, setExtractionComplete] = useState(false);
//   const [rubricsGenerated, setRubricsGenerated] = useState(false);
//   const [workflowComplete, setWorkflowComplete] = useState(false);
//   const [resultsAvailable, setResultsAvailable] = useState(false);

//   // Initialize from localStorage on mount
//   useEffect(() => {
//     const saved = localStorage.getItem('sessionId');
//     if (saved) {
//       setSessionId(saved);
      
//       // Check if extraction is complete
//       fetch(`http://localhost:8000/hil/${saved}`)
//         .then(r => r.json())
//         .then(data => {
//           if (data.hil_data && Object.keys(data.hil_data).length > 0) {
//             setExtractionComplete(true);
//           }
//         })
//         .catch(() => {});
      
//       // Check if rubrics exist
//       fetch(`http://localhost:8000/rubrics/${saved}`)
//         .then(r => r.json())
//         .then(data => {
//           if (data.rubrics && data.rubrics.length > 0) {
//             setRubricsGenerated(true);
//           }
//         })
//         .catch(() => {});
//     }
//   }, []);

//   // Overall workflow progress
//   const workflowStages = [
//     { 
//       id: 'upload', 
//       name: 'Document Upload', 
//       status: sessionId ? 'completed' : 'active', 
//       progress: sessionId ? 100 : 0 
//     },
//     { 
//       id: 'extraction', 
//       name: 'Guideline Extraction', 
//       status: extractionComplete ? 'completed' : (sessionId ? 'active' : 'pending'), 
//       progress: extractionComplete ? 100 : 0 
//     },
//     { 
//       id: 'rubrics', 
//       name: 'QA Rubric Management', 
//       status: rubricsGenerated ? 'completed' : (extractionComplete ? 'active' : 'pending'), 
//       progress: rubricsGenerated ? 100 : 0 
//     },
//     { 
//       id: 'workflow', 
//       name: 'Workflow Execution', 
//       status: workflowComplete ? 'completed' : (rubricsGenerated ? 'active' : 'pending'), 
//       progress: workflowComplete ? 100 : 0 
//     },
//     { 
//       id: 'results', 
//       name: 'QA Results', 
//       status: resultsAvailable ? 'completed' : (workflowComplete ? 'active' : 'pending'), 
//       progress: resultsAvailable ? 100 : 0 
//     },
//     { 
//       id: 'dashboard', 
//       name: 'Quality Dashboard', 
//       status: resultsAvailable ? 'active' : 'pending', 
//       progress: resultsAvailable ? 100 : 0 
//     }
//   ];

//   const getStageIcon = (id: string) => {
//     switch (id) {
//       case 'upload': return <Upload className="w-4 h-4" />;
//       case 'extraction': return <Brain className="w-4 h-4" />;
//       case 'rubrics': return <Target className="w-4 h-4" />;
//       case 'workflow': return <Workflow className="w-4 h-4" />;
//       case 'results': return <FileText className="w-4 h-4" />;
//       case 'dashboard': return <BarChart3 className="w-4 h-4" />;
//       default: return <FileText className="w-4 h-4" />;
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
//       case 'in-progress': return <Clock className="w-4 h-4 text-blue-500" />;
//       case 'active': return <Clock className="w-4 h-4 text-blue-500" />;
//       default: return <Clock className="w-4 h-4 text-gray-400" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'completed': return 'default';
//       case 'in-progress': return 'secondary';
//       case 'active': return 'secondary';
//       default: return 'outline';
//     }
//   };

//   const handleUploadComplete = (sid: string) => {
//     setSessionId(sid);
//     setActiveTab('extraction');
//   };

//   const handleExtractionComplete = () => {
//     setExtractionComplete(true);
//   };

//   const handleRubricsGenerated = () => {
//     setRubricsGenerated(true);
//   };

//   const handleWorkflowGenerated = () => {
//     setWorkflowComplete(true);
//     setResultsAvailable(true);
//     console.log('Workflow generated successfully');
//   };
//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="text-center space-y-2">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Quality Assurance Management System
//           </h1>
//           <p className="text-lg text-gray-600">
//             End-to-end workflow for document processing, guideline extraction, and quality validation
//           </p>
//         </div>

//         {/* Workflow Progress Overview */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Workflow Progress</CardTitle>
//             <CardDescription>
//               Track progress through the complete quality assurance pipeline
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//               {workflowStages.map((stage, index) => (
//                 <div key={stage.id} className="relative">
//                   <div 
//                     className={`p-4 border rounded-lg cursor-pointer transition-colors ${
//                       activeTab === stage.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
//                     } ${stage.status === 'pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     onClick={() => {
//                       if (stage.status !== 'pending') setActiveTab(stage.id);
//                     }}
//                   >
//                     <div className="flex items-center justify-between mb-2">
//                       {getStageIcon(stage.id)}
//                       {getStatusIcon(stage.status)}
//                     </div>
//                     <h4 className="text-sm font-medium mb-1">{stage.name}</h4>
//                     <div>
//                       <Badge variant={getStatusColor(stage.status)} className="text-xs">
//                         {stage.status}
//                       </Badge>
//                     </div>
//                   </div>
                  
//                   {/* Arrow connector */}
//                   {index < workflowStages.length - 1 && (
//                     <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
//                       <div className="w-4 h-0.5 bg-gray-300"></div>
//                       <div className="w-0 h-0 border-l-2 border-l-gray-300 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-3 -mt-1"></div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Main Content Tabs */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-6">
//             <TabsTrigger value="upload" className="flex items-center space-x-2">
//               <Upload className="w-4 h-4" />
//               <span>Upload</span>
//             </TabsTrigger>
//             <TabsTrigger 
//               value="extraction" 
//               className="flex items-center space-x-2"
//               disabled={!sessionId}
//             >
//               <Brain className="w-4 h-4" />
//               <span>Extraction</span>
//             </TabsTrigger>
//             <TabsTrigger 
//               value="rubrics" 
//               className="flex items-center space-x-2"
//               disabled={!extractionComplete}
//             >
//               <Target className="w-4 h-4" />
//               <span>Rubrics</span>
//             </TabsTrigger>
//             <TabsTrigger value="workflow" className="flex items-center space-x-2">
//               <Workflow className="w-4 h-4" />
//               <span>Workflow</span>
//             </TabsTrigger>
//             <TabsTrigger value="results" className="flex items-center space-x-2">
//               <FileText className="w-4 h-4" />
//               <span>QA Results</span>
//             </TabsTrigger>
//             <TabsTrigger value="dashboard" className="flex items-center space-x-2">
//               <BarChart3 className="w-4 h-4" />
//               <span>Quality Dashboard</span>
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="upload" className="mt-6">
//             <DocumentUpload onUploaded={handleUploadComplete} />
//           </TabsContent>

//           <TabsContent value="extraction" className="mt-6">
//             <GuidelineExtraction 
//               sessionId={sessionId}
//               onExtractionComplete={handleExtractionComplete}
//             />
//           </TabsContent>

//           <TabsContent value="rubrics" className="mt-6">
//             <QARubricManagement 
//               sessionId={sessionId}
//               onRubricsGenerated={handleRubricsGenerated}
//             />
//           </TabsContent>

//           <TabsContent value="workflow" className="mt-6">
//             <WorkflowManagement 
//               sessionId={sessionId}
//               onWorkflowGenerated={handleWorkflowGenerated}
//             />
//           </TabsContent>
          
//           <TabsContent value="results" className="mt-6">
//             <QualityAgentResults />
//           </TabsContent>

//           <TabsContent value="dashboard" className="mt-6">
//             <QualityDashboard />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
// import { Badge } from './components/ui/badge';
// import { 
//   Upload, 
//   Brain, 
//   Target, 
//   Workflow, 
//   BarChart3, 
//   FileText,
//   CheckCircle,
//   Clock,
//   List
// } from 'lucide-react';

// import { DocumentUpload } from './components/DocumentUpload';
// import { GuidelineSummary } from './components/GuidelineSummary';
// import { GuidelineExtraction } from './components/GuidelineExtraction';
// import { QARubricManagement } from './components/QARubricManagement';
// import { WorkflowManagement } from './components/WorkflowManagement';
// import { QualityDashboard } from './components/QualityDashboard';
// import { QualityAgentResults } from './components/QualityAgentResults';

// export default function App() {
//   const [activeTab, setActiveTab] = useState('upload');
//   const [sessionId, setSessionId] = useState<string | null>(null);
//   const [summaryComplete, setSummaryComplete] = useState(false);
//   const [extractionComplete, setExtractionComplete] = useState(false);
//   const [rubricsGenerated, setRubricsGenerated] = useState(false);
//   const [workflowComplete, setWorkflowComplete] = useState(false);
//   const [resultsAvailable, setResultsAvailable] = useState(false);

//   // Initialize from localStorage on mount
//   useEffect(() => {
//     const saved = localStorage.getItem('sessionId');
//     if (saved) {
//       setSessionId(saved);
      
//       // Check if extraction is complete
//       fetch(`http://localhost:8000/hil/${saved}`)
//         .then(r => r.json())
//         .then(data => {
//           if (data.hil_data && Object.keys(data.hil_data).length > 0) {
//             setExtractionComplete(true);
//           }
//         })
//         .catch(() => {});
      
//       // Check if rubrics exist
//       fetch(`http://localhost:8000/rubrics/${saved}`)
//         .then(r => r.json())
//         .then(data => {
//           if (data.rubrics && data.rubrics.length > 0) {
//             setRubricsGenerated(true);
//           }
//         })
//         .catch(() => {});
//     }
//   }, []);

//   // Overall workflow progress
//   const workflowStages = [
//     { 
//       id: 'upload', 
//       name: 'Document Upload', 
//       status: sessionId ? 'completed' : 'active', 
//       progress: sessionId ? 100 : 0 
//     },
//     { 
//       id: 'summary', 
//       name: 'Guideline Summary', 
//       status: summaryComplete ? 'completed' : (sessionId ? 'active' : 'pending'), 
//       progress: summaryComplete ? 100 : 0 
//     },
//     { 
//       id: 'extraction', 
//       name: 'Guideline Extraction', 
//       status: extractionComplete ? 'completed' : (summaryComplete ? 'active' : 'pending'), 
//       progress: extractionComplete ? 100 : 0 
//     },
//     { 
//       id: 'rubrics', 
//       name: 'QA Rubric Management', 
//       status: rubricsGenerated ? 'completed' : (extractionComplete ? 'active' : 'pending'), 
//       progress: rubricsGenerated ? 100 : 0 
//     },
//     { 
//       id: 'workflow', 
//       name: 'Workflow Execution', 
//       status: workflowComplete ? 'completed' : (rubricsGenerated ? 'active' : 'pending'), 
//       progress: workflowComplete ? 100 : 0 
//     },
//     { 
//       id: 'results', 
//       name: 'QA Results', 
//       status: resultsAvailable ? 'completed' : (workflowComplete ? 'active' : 'pending'), 
//       progress: resultsAvailable ? 100 : 0 
//     },
//     { 
//       id: 'dashboard', 
//       name: 'Quality Dashboard', 
//       status: resultsAvailable ? 'active' : 'pending', 
//       progress: resultsAvailable ? 100 : 0 
//     }
//   ];

//   const getStageIcon = (id: string) => {
//     switch (id) {
//       case 'upload': return <Upload className="w-4 h-4" />;
//       case 'summary': return <List className="w-4 h-4" />;
//       case 'extraction': return <Brain className="w-4 h-4" />;
//       case 'rubrics': return <Target className="w-4 h-4" />;
//       case 'workflow': return <Workflow className="w-4 h-4" />;
//       case 'results': return <FileText className="w-4 h-4" />;
//       case 'dashboard': return <BarChart3 className="w-4 h-4" />;
//       default: return <FileText className="w-4 h-4" />;
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
//       case 'in-progress': return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
//       case 'active': return <Clock className="w-4 h-4 text-blue-500" />;
//       default: return <Clock className="w-4 h-4 text-gray-400" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'completed': return 'default';
//       case 'in-progress': return 'secondary';
//       case 'active': return 'secondary';
//       default: return 'outline';
//     }
//   };

//   const handleUploadComplete = (sid: string) => {
//     setSessionId(sid);
//     // Auto-navigate to summary tab after upload
//     setTimeout(() => {
//       setActiveTab('summary');
//     }, 500);
//   };

//   const handleSummaryComplete = () => {
//     setSummaryComplete(true);
//   };

//   const handleExtractionComplete = () => {
//     setExtractionComplete(true);
//   };

//   const handleRubricsGenerated = () => {
//     setRubricsGenerated(true);
//   };

//   const handleWorkflowGenerated = () => {
//     setWorkflowComplete(true);
//     setResultsAvailable(true);
//     console.log('Workflow generated successfully');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="text-center space-y-2">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Quality Assurance Management System
//           </h1>
//           <p className="text-lg text-gray-600">
//             End-to-end workflow for document processing, guideline extraction, and quality validation
//           </p>
//         </div>

//         {/* Workflow Progress Overview */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Workflow Progress</CardTitle>
//             <CardDescription>
//               Track progress through the complete quality assurance pipeline
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
//               {workflowStages.map((stage, index) => (
//                 <div key={stage.id} className="relative">
//                   <div 
//                     className={`p-4 border rounded-lg cursor-pointer transition-colors ${
//                       activeTab === stage.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
//                     } ${stage.status === 'pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     onClick={() => {
//                       if (stage.status !== 'pending') setActiveTab(stage.id);
//                     }}
//                   >
//                     <div className="flex items-center justify-between mb-2">
//                       {getStageIcon(stage.id)}
//                       {getStatusIcon(stage.status)}
//                     </div>
//                     <h4 className="text-sm font-medium mb-1">{stage.name}</h4>
//                     <div>
//                       <Badge variant={getStatusColor(stage.status)} className="text-xs">
//                         {stage.status}
//                       </Badge>
//                     </div>
//                   </div>
                  
//                   {/* Arrow connector */}
//                   {index < workflowStages.length - 1 && (
//                     <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
//                       <div className="w-4 h-0.5 bg-gray-300"></div>
//                       <div className="w-0 h-0 border-l-2 border-l-gray-300 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-3 -mt-1"></div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Main Content Tabs */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="w-full h-auto bg-gray-100 p-2 flex justify-start gap-2">
//             <TabsTrigger 
//               value="upload" 
//               className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white"
//             >
//               <Upload className="w-4 h-4" />
//               <span>Upload</span>
//             </TabsTrigger>
//             <TabsTrigger 
//               value="summary" 
//               className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white"
//               disabled={!sessionId}
//             >
//               <List className="w-4 h-4" />
//               <span>Summary</span>
//             </TabsTrigger>
//             <TabsTrigger 
//               value="extraction" 
//               className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white"
//               disabled={!sessionId}
//             >
//               <Brain className="w-4 h-4" />
//               <span>Extraction</span>
//             </TabsTrigger>
//             <TabsTrigger 
//               value="rubrics" 
//               className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white"
//               disabled={!extractionComplete}
//             >
//               <Target className="w-4 h-4" />
//               <span>Rubrics</span>
//             </TabsTrigger>
//             <TabsTrigger 
//               value="workflow" 
//               className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white"
//             >
//               <Workflow className="w-4 h-4" />
//               <span>Workflow</span>
//             </TabsTrigger>
//             <TabsTrigger 
//               value="results" 
//               className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white"
//             >
//               <FileText className="w-4 h-4" />
//               <span>QA Results</span>
//             </TabsTrigger>
//             <TabsTrigger 
//               value="dashboard" 
//               className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white"
//             >
//               <BarChart3 className="w-4 h-4" />
//               <span>Quality Dashboard</span>
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="upload" className="mt-6">
//             <DocumentUpload onUploaded={handleUploadComplete} />
//           </TabsContent>

//           <TabsContent value="summary" className="mt-6">
//             <GuidelineSummary 
//               sessionId={sessionId}
//               isActive={activeTab === 'summary'}
//               onSummaryComplete={handleSummaryComplete}
//             />
//           </TabsContent>

//           <TabsContent value="extraction" className="mt-6">
//             <GuidelineExtraction 
//               sessionId={sessionId}
//               onExtractionComplete={handleExtractionComplete}
//             />
//           </TabsContent>

//           <TabsContent value="rubrics" className="mt-6">
//             <QARubricManagement 
//               sessionId={sessionId}
//               onRubricsGenerated={handleRubricsGenerated}
//             />
//           </TabsContent>

//           <TabsContent value="workflow" className="mt-6">
//             <WorkflowManagement 
//               sessionId={sessionId}
//               onWorkflowGenerated={handleWorkflowGenerated}
//             />
//           </TabsContent>
          
//           <TabsContent value="results" className="mt-6">
//             <QualityAgentResults />
//           </TabsContent>

//           <TabsContent value="dashboard" className="mt-6">
//             <QualityDashboard />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
// import { Badge } from './components/ui/badge';
// import { 
//   Upload, 
//   Brain, 
//   Target, 
//   Workflow, 
//   BarChart3, 
//   FileText,
//   CheckCircle,
//   Clock,
//   List
// } from 'lucide-react';

// import { DocumentUpload } from './components/DocumentUpload';
// import { GuidelineSummary } from './components/GuidelineSummary';
// import { GuidelineExtraction } from './components/GuidelineExtraction';
// import { QARubricManagement } from './components/QARubricManagement';
// import { WorkflowManagement } from './components/WorkflowManagement';
// import { QualityDashboard } from './components/QualityDashboard';
// import { QualityAgentResults } from './components/QualityAgentResults';

// export default function App() {
//   const [activeTab, setActiveTab] = useState('upload');
//   const [sessionId, setSessionId] = useState<string | null>(null);
//   const [summaryComplete, setSummaryComplete] = useState(false);
//   const [extractionComplete, setExtractionComplete] = useState(false);
//   const [rubricsGenerated, setRubricsGenerated] = useState(false);
//   const [workflowComplete, setWorkflowComplete] = useState(false);
//   const [resultsAvailable, setResultsAvailable] = useState(false);

//   // Initialize from localStorage on mount
//   useEffect(() => {
//     const saved = localStorage.getItem('sessionId');
//     if (saved) {
//       setSessionId(saved);
      
//       // Check if extraction is complete
//       fetch(`http://localhost:8000/hil/${saved}`)
//         .then(r => r.json())
//         .then(data => {
//           if (data.hil_data && Object.keys(data.hil_data).length > 0) {
//             setExtractionComplete(true);
//           }
//         })
//         .catch(() => {});
      
//       // Check if rubrics exist
//       fetch(`http://localhost:8000/rubrics/${saved}`)
//         .then(r => r.json())
//         .then(data => {
//           if (data.rubrics && data.rubrics.length > 0) {
//             setRubricsGenerated(true);
//           }
//         })
//         .catch(() => {});
//     }
//   }, []);

//   // Overall workflow progress
//   const workflowStages = [
//     { 
//       id: 'upload', 
//       name: 'Document Upload', 
//       status: sessionId ? 'completed' : 'active', 
//       progress: sessionId ? 100 : 0 
//     },
//     { 
//       id: 'summary', 
//       name: 'Guideline Summary', 
//       status: summaryComplete ? 'completed' : (sessionId ? 'active' : 'pending'), 
//       progress: summaryComplete ? 100 : 0 
//     },
//     { 
//       id: 'extraction', 
//       name: 'Guideline Extraction', 
//       status: extractionComplete ? 'completed' : (summaryComplete ? 'active' : 'pending'), 
//       progress: extractionComplete ? 100 : 0 
//     },
//     { 
//       id: 'rubrics', 
//       name: 'QA Rubric', 
//       status: rubricsGenerated ? 'completed' : (extractionComplete ? 'active' : 'pending'), 
//       progress: rubricsGenerated ? 100 : 0 
//     },
//     { 
//       id: 'workflow', 
//       name: 'Workflow Execution', 
//       status: workflowComplete ? 'completed' : (rubricsGenerated ? 'active' : 'pending'), 
//       progress: workflowComplete ? 100 : 0 
//     },
//     { 
//       id: 'results', 
//       name: 'QA Results', 
//       status: resultsAvailable ? 'completed' : (workflowComplete ? 'active' : 'pending'), 
//       progress: resultsAvailable ? 100 : 0 
//     },
//     { 
//       id: 'dashboard', 
//       name: 'Quality Dashboard', 
//       status: resultsAvailable ? 'active' : 'pending', 
//       progress: resultsAvailable ? 100 : 0 
//     }
//   ];

//   const getStageIcon = (id: string) => {
//     switch (id) {
//       case 'upload': return <Upload className="w-5 h-5" />;
//       case 'summary': return <List className="w-5 h-5" />;
//       case 'extraction': return <Brain className="w-5 h-5" />;
//       case 'rubrics': return <Target className="w-5 h-5" />;
//       case 'workflow': return <Workflow className="w-5 h-5" />;
//       case 'results': return <FileText className="w-5 h-5" />;
//       case 'dashboard': return <BarChart3 className="w-5 h-5" />;
//       default: return <FileText className="w-5 h-5" />;
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
//       case 'in-progress': return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
//       case 'active': return <Clock className="w-5 h-5 text-blue-500" />;
//       default: return <Clock className="w-5 h-5 text-gray-400" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'completed': return 'default';
//       case 'in-progress': return 'secondary';
//       case 'active': return 'secondary';
//       default: return 'outline';
//     }
//   };

//   const handleUploadComplete = (sid: string) => {
//     setSessionId(sid);
//     // Auto-navigate to summary tab after upload
//     setTimeout(() => {
//       setActiveTab('summary');
//     }, 500);
//   };

//   const handleSummaryComplete = () => {
//     setSummaryComplete(true);
//   };

//   const handleExtractionComplete = () => {
//     setExtractionComplete(true);
//   };

//   const handleRubricsGenerated = () => {
//     setRubricsGenerated(true);
//   };

//   const handleWorkflowGenerated = () => {
//     setWorkflowComplete(true);
//     setResultsAvailable(true);
//     console.log('Workflow generated successfully');
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="text-center space-y-2">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Quality Assurance Management System
//           </h1>
//           <p className="text-lg text-gray-600">
//             End-to-end workflow for document processing, guideline extraction, and quality validation
//           </p>
//         </div>

//         {/* Workflow Progress Overview - HORIZONTAL SINGLE ROW */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Workflow Progress</CardTitle>
//             <CardDescription>
//               Track progress through the complete quality assurance pipeline
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="flex gap-4 overflow-x-auto pb-2">
//               {workflowStages.map((stage, index) => (
//                 <div key={stage.id} className="relative flex-shrink-0" style={{ width: '180px' }}>
//                   <div 
//                     className={`w-[160px] p-4 border rounded-lg cursor-pointer transition-all ${
//                       activeTab === stage.id 
//                         ? 'border-blue-500 bg-blue-50 shadow-sm' 
//                         : 'border-gray-200 hover:border-gray-300'
//                     } ${stage.status === 'pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
//                     onClick={() => {
//                       if (stage.status !== 'pending') setActiveTab(stage.id);
//                     }}
//                   >
//                     {/* Icon and Status - Top Row */}
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="text-gray-700">
//                         {getStageIcon(stage.id)}
//                       </div>
//                       {getStatusIcon(stage.status)}
//                     </div>
                    
//                     {/* Stage Name */}
//                     <h4 className="text-sm font-medium text-gray-900 mb-2 leading-tight">
//                       {stage.name}
//                     </h4>
                    
//                     {/* Status Badge */}
//                     <Badge 
//                       variant={getStatusColor(stage.status)} 
//                       className="text-xs capitalize"
//                     >
//                       {stage.status}
//                     </Badge>
//                   </div>
                  
//                   {/* Arrow connector */}
//                   {index < workflowStages.length - 1 && (
//                     <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-10 text-gray-300">
//                       <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//                         <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Main Content Tabs */}
//         <Card>
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             {/* Tab Navigation Bar */}
//             <div className="border-b bg-gray-50">
//               <div className="overflow-x-auto">
//                 <TabsList className="inline-flex h-auto bg-transparent p-2 w-full justify-start min-w-max">
//                   <TabsTrigger 
//                     value="upload" 
//                     className="inline-flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
//                   >
//                     <Upload className="w-4 h-4" />
//                     <span>Upload</span>
//                   </TabsTrigger>
                  
//                   <TabsTrigger 
//                     value="summary" 
//                     className="inline-flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
//                     disabled={!sessionId}
//                   >
//                     <List className="w-4 h-4" />
//                     <span>Summary</span>
//                   </TabsTrigger>
                  
//                   <TabsTrigger 
//                     value="extraction" 
//                     className="inline-flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
//                     disabled={!sessionId}
//                   >
//                     <Brain className="w-4 h-4" />
//                     <span>Extraction</span>
//                   </TabsTrigger>
                  
//                   <TabsTrigger 
//                     value="rubrics" 
//                     className="inline-flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
//                     disabled={!extractionComplete}
//                   >
//                     <Target className="w-4 h-4" />
//                     <span>Rubrics</span>
//                   </TabsTrigger>
                  
//                   <TabsTrigger 
//                     value="workflow" 
//                     className="inline-flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
//                   >
//                     <Workflow className="w-4 h-4" />
//                     <span>Workflow</span>
//                   </TabsTrigger>
                  
//                   <TabsTrigger 
//                     value="results" 
//                     className="inline-flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
//                   >
//                     <FileText className="w-4 h-4" />
//                     <span>QA Results</span>
//                   </TabsTrigger>
                  
//                   <TabsTrigger 
//                     value="dashboard" 
//                     className="inline-flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
//                   >
//                     <BarChart3 className="w-4 h-4" />
//                     <span>Dashboard</span>
//                   </TabsTrigger>
//                 </TabsList>
//               </div>
//             </div>

//             {/* Tab Content */}
//             <CardContent className="p-6">
//               <TabsContent value="upload" className="mt-0">
//                 <DocumentUpload onUploaded={handleUploadComplete} />
//               </TabsContent>

//               <TabsContent value="summary" className="mt-0">
//                 <GuidelineSummary 
//                   sessionId={sessionId}
//                   isActive={activeTab === 'summary'}
//                   onSummaryComplete={handleSummaryComplete}
//                 />
//               </TabsContent>

//               <TabsContent value="extraction" className="mt-0">
//                 <GuidelineExtraction 
//                   sessionId={sessionId}
//                   onExtractionComplete={handleExtractionComplete}
//                 />
//               </TabsContent>

//               <TabsContent value="rubrics" className="mt-0">
//                 <QARubricManagement 
//                   sessionId={sessionId}
//                   onRubricsGenerated={handleRubricsGenerated}
//                 />
//               </TabsContent>

//               <TabsContent value="workflow" className="mt-0">
//                 <WorkflowManagement 
//                   sessionId={sessionId}
//                   onWorkflowGenerated={handleWorkflowGenerated}
//                 />
//               </TabsContent>
              
//               <TabsContent value="results" className="mt-0">
//                 <QualityAgentResults />
//               </TabsContent>

//               <TabsContent value="dashboard" className="mt-0">
//                 <QualityDashboard />
//               </TabsContent>
//             </CardContent>
//           </Tabs>
//         </Card>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { 
  Upload, 
  Brain, 
  Target, 
  Workflow, 
  BarChart3, 
  FileText,
  CheckCircle,
  Clock,
  List,
  RotateCcw
} from 'lucide-react';

import { DocumentUpload } from './components/DocumentUpload';
import { GuidelineSummary } from './components/GuidelineSummary';
import { GuidelineExtraction } from './components/GuidelineExtraction';
import { QARubricManagement } from './components/QARubricManagement';
import { WorkflowManagement } from './components/WorkflowManagement';
import { QAResults as QAResultsMississippi } from './components/QAResults-Mississippi';
import { QualityDashboard as QualityDashboardMississippi } from './components/QualityDashboard-Mississippi';

export default function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [summaryComplete, setSummaryComplete] = useState(false);
  const [extractionComplete, setExtractionComplete] = useState(false);
  const [rubricsGenerated, setRubricsGenerated] = useState(false);
  const [workflowComplete, setWorkflowComplete] = useState(false);
  const [resultsAvailable, setResultsAvailable] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sessionId');
    if (saved) {
      setSessionId(saved);
      
      // Check if extraction is complete
      fetch(`/api/hil/${saved}`)
        .then(r => {
          if (!r.ok) return null;
          return r.json();
        })
        .then(data => {
          if (data && data.hil_data && Object.keys(data.hil_data).length > 0) {
            setExtractionComplete(true);
          }
        })
        .catch(() => {});
      
      // Check if rubrics exist
      fetch(`/api/rubrics/${saved}`)
        .then(r => {
          if (!r.ok) return null;
          return r.json();
        })
        .then(data => {
          if (data && data.rubrics && data.rubrics.length > 0) {
            setRubricsGenerated(true);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Overall workflow progress
  const workflowStages = [
    { 
      id: 'upload', 
      name: 'Document Upload', 
      status: sessionId ? 'completed' : 'active', 
      progress: sessionId ? 100 : 0 
    },
    { 
      id: 'summary', 
      name: 'Guideline Summary', 
      status: summaryComplete ? 'completed' : (sessionId ? 'active' : 'pending'), 
      progress: summaryComplete ? 100 : 0 
    },
    { 
      id: 'extraction', 
      name: 'Guideline Extraction', 
      status: extractionComplete ? 'completed' : (summaryComplete ? 'active' : 'pending'), 
      progress: extractionComplete ? 100 : 0 
    },
    { 
      id: 'rubrics', 
      name: 'QA Rubric', 
      status: rubricsGenerated ? 'completed' : (extractionComplete ? 'active' : 'pending'), 
      progress: rubricsGenerated ? 100 : 0 
    },
    { 
      id: 'workflow', 
      name: 'Workflow Execution', 
      status: workflowComplete ? 'completed' : (rubricsGenerated ? 'active' : 'pending'), 
      progress: workflowComplete ? 100 : 0 
    },
    { 
      id: 'results', 
      name: 'QA Results', 
      status: resultsAvailable ? 'completed' : (workflowComplete ? 'active' : 'pending'), 
      progress: resultsAvailable ? 100 : 0 
    },
    { 
      id: 'dashboard', 
      name: 'Quality Dashboard', 
      status: resultsAvailable ? 'active' : 'pending', 
      progress: resultsAvailable ? 100 : 0 
    }
  ];

  const getStageIcon = (id: string) => {
    switch (id) {
      case 'upload': return <Upload className="w-5 h-5" />;
      case 'summary': return <List className="w-5 h-5" />;
      case 'extraction': return <Brain className="w-5 h-5" />;
      case 'rubrics': return <Target className="w-5 h-5" />;
      case 'workflow': return <Workflow className="w-5 h-5" />;
      case 'results': return <FileText className="w-5 h-5" />;
      case 'dashboard': return <BarChart3 className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'active': return <Clock className="w-5 h-5 text-blue-500" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'active': return 'secondary';
      default: return 'outline';
    }
  };

  const handleUploadComplete = (sid: string) => {
    setSessionId(sid);
    // Auto-navigate to summary tab after upload
    setTimeout(() => {
      setActiveTab('summary');
    }, 500);
  };

  const handleSummaryComplete = () => {
    setSummaryComplete(true);
  };

  const handleExtractionComplete = () => {
    setExtractionComplete(true);
  };

  const handleRubricsGenerated = () => {
    setRubricsGenerated(true);
  };

  const handleWorkflowGenerated = () => {
    setWorkflowComplete(true);
    setResultsAvailable(true);
    console.log('Workflow generated successfully');
  };

  const handleNewSession = () => {
    // Clear localStorage
    localStorage.removeItem('sessionId');
    
    // Reset all state variables
    setSessionId(null);
    setSummaryComplete(false);
    setExtractionComplete(false);
    setRubricsGenerated(false);
    setWorkflowComplete(false);
    setResultsAvailable(false);
    
    // Navigate back to upload tab
    setActiveTab('upload');
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Quality Assurance Management System
            </h1>
            <p className="text-lg text-gray-600">
              End-to-end workflow for document processing, guideline extraction, and quality validation
            </p>
          </div>
          
          {/* New Session Button - Top Right */}
          {sessionId && (
            <div className="absolute top-0 right-0">
              <Button 
                variant="outline" 
                onClick={handleNewSession}
                className="flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New Session</span>
              </Button>
            </div>
          )}
        </div>

        {/* Workflow Progress Overview - HORIZONTAL SINGLE ROW */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Progress</CardTitle>
            <CardDescription>
              Track progress through the complete quality assurance pipeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {workflowStages.map((stage, index) => (
                <div key={stage.id} className="relative flex-shrink-0" style={{ width: '180px' }}>
                  <div 
                    className={`w-[160px] p-4 border rounded-lg cursor-pointer transition-all ${
                      activeTab === stage.id 
                        ? 'border-blue-500 bg-blue-50 shadow-sm' 
                        : 'border-gray-200 hover:border-gray-300'
                    } ${stage.status === 'pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => {
                      if (stage.status !== 'pending') setActiveTab(stage.id);
                    }}
                  >
                    {/* Icon and Status - Top Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-gray-700">
                        {getStageIcon(stage.id)}
                      </div>
                      {getStatusIcon(stage.status)}
                    </div>
                    
                    {/* Stage Name */}
                    <h4 className="text-sm font-medium text-gray-900 mb-2 leading-tight">
                      {stage.name}
                    </h4>
                    
                    {/* Status Badge */}
                    <Badge 
                      variant={getStatusColor(stage.status)} 
                      className="text-xs capitalize"
                    >
                      {stage.status}
                    </Badge>
                  </div>
                  
                  {/* Arrow connector */}
                  {index < workflowStages.length - 1 && (
                    <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-10 text-gray-300">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation Bar */}
            <div className="border-b bg-gray-50">
              <div className="overflow-x-auto">
                <TabsList className="inline-flex h-auto bg-transparent p-2 w-full justify-start min-w-max">
                  <TabsTrigger 
                    value="upload" 
                    className="inline-flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="summary" 
                    className="inline-flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                    disabled={!sessionId}
                  >
                    <List className="w-4 h-4" />
                    <span>Summary</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="extraction" 
                    className="inline-flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                    disabled={!sessionId}
                  >
                    <Brain className="w-4 h-4" />
                    <span>Extraction</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="rubrics" 
                    className="inline-flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                    disabled={!extractionComplete}
                  >
                    <Target className="w-4 h-4" />
                    <span>Rubrics</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="workflow" 
                    className="inline-flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                  >
                    <Workflow className="w-4 h-4" />
                    <span>Workflow</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="results" 
                    className="inline-flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                  >
                    <FileText className="w-4 h-4" />
                    <span>QA Results</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="dashboard" 
                    className="inline-flex items-center gap-2 px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Dashboard</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Tab Content */}
            <CardContent className="p-6">
              <TabsContent value="upload" className="mt-0">
                <DocumentUpload onUploaded={handleUploadComplete} />
              </TabsContent>

              <TabsContent value="summary" className="mt-0">
                <GuidelineSummary 
                  sessionId={sessionId}
                  isActive={activeTab === 'summary'}
                  onSummaryComplete={handleSummaryComplete}
                />
              </TabsContent>

              <TabsContent value="extraction" className="mt-0">
                <GuidelineExtraction 
                  sessionId={sessionId}
                  onExtractionComplete={handleExtractionComplete}
                />
              </TabsContent>

              <TabsContent value="rubrics" className="mt-0">
                <QARubricManagement 
                  sessionId={sessionId}
                  onRubricsGenerated={handleRubricsGenerated}
                />
              </TabsContent>

              <TabsContent value="workflow" className="mt-0">
                <WorkflowManagement 
                  sessionId={sessionId}
                  onWorkflowGenerated={handleWorkflowGenerated}
                />
              </TabsContent>
              
              <TabsContent value="results" className="mt-0">
                <QAResultsMississippi />
              </TabsContent>

              <TabsContent value="dashboard" className="mt-0">
                <QualityDashboardMississippi />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}