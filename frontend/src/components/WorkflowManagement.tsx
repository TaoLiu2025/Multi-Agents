// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// // import { Badge } from './ui/badge';
// // import { Button } from './ui/button';
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// // import { 
// //   Workflow, 
// //   Play, 
// //   Pause, 
// //   CheckCircle,
// //   ArrowDown,
// //   ArrowRight,
// //   Settings,
// //   Target,
// //   Shield,
// //   Brain,
// //   Database,
// //   FileCheck,
// //   AlertTriangle,
// //   Bot,
// //   GitBranch,
// //   List,
// //   Upload,
// //   Download,
// //   Sparkles,
// //   ClipboardList,
// //   Users,
// //   BarChart3,
// //   CheckSquare,
// //   Cloud
// // } from 'lucide-react';
// // import { useState } from 'react';

// // interface WorkflowAgent {
// //   Agent_name: string;
// //   Role_description: string;
// //   Skillset: string[];
// //   Domain_knowledge: string[];
// //   Guidelines: string[];
// //   Validations: string[];
// //   Decision_points: string[];
// //   Sequence_position: number;
// //   HIL_escalation_triggers: string[];
// // }

// // interface WorkflowStep {
// //   Step_name: string;
// //   Description: string;
// //   Expected_output: string;
// // }

// // interface WorkflowData {
// //   Workflow_Overview: {
// //     Workflow_name: string;
// //     Total_agents: number;
// //     Total_guidelines_covered: number;
// //     Workflow_description: string;
// //     Execution_sequence: string[];
// //     Validation_framework: string;
// //   };
// //   Workflow_Process: WorkflowStep[];
// //   Agents: WorkflowAgent[];
// //   Workflow_Summary: {
// //     Objective: string;
// //     Key_phases: string[];
// //     Final_outputs: string[];
// //     Quality_assurance: string;
// //   };
// //   Guideline_coverage_verification: {
// //     Input_guidelines_count: number;
// //     Output_guidelines_count: number;
// //     Coverage_status: string;
// //   };
// // }

// // type Props = {
// //   sessionId?: string | null;
// //   onWorkflowGenerated?: () => void;
// // };

// // export function WorkflowManagement({ sessionId, onWorkflowGenerated }: Props) {
// //   const [workflowTab, setWorkflowTab] = useState('process');
// //   const [isApproved, setIsApproved] = useState(false);

// //   // Comprehensive workflow data from the sample output
// //   const workflowData: WorkflowData = {
// //     Workflow_Overview: {
// //       Workflow_name: "Comprehensive Workflow",
// //       Total_agents: 5,
// //       Total_guidelines_covered: 78,
// //       Workflow_description: "Multi-agent workflow for guideline compliance verification and fact-checking with HIL escalation",
// //       Execution_sequence: [
// //         "Bounding Box Agent",
// //         "Labeling Accuracy Agent",
// //         "Spoof Label Agent",
// //         "Playback and Annotation Agent",
// //         "Tagging Standards Agent"
// //       ],
// //       Validation_framework: "Multi-stage validation with automated checks and human escalation points"
// //     },
// //     Workflow_Process: [
// //       {
// //         Step_name: "Step 1: Data Input from Storage",
// //         Description: "Retrieve raw annotation data, documents, and video files from cloud storage (Azure Blob/AWS S3)",
// //         Expected_output: "Raw data files loaded and ready for processing"
// //       },
// //       {
// //         Step_name: "Step 2: Guideline Extraction",
// //         Description: "AI-powered extraction of guidelines from documents with confidence scoring and clustering",
// //         Expected_output: "Structured guidelines with categories, confidence scores, and source references"
// //       },
// //       {
// //         Step_name: "Step 3: QA Rubric Generation",
// //         Description: "Automatically generate quality rubrics with error types, criticality levels, and penalty systems",
// //         Expected_output: "Comprehensive QA rubrics with validation rules and scoring criteria"
// //       },
// //       {
// //         Step_name: "Step 4: Human & AI Agent Annotation",
// //         Description: "Parallel annotation workflow where human annotators and AI agents perform video/image annotation",
// //         Expected_output: "Completed annotations with bounding boxes, labels, and metadata"
// //       },
// //       {
// //         Step_name: "Step 5: Quality Assessment & Validation",
// //         Description: "Quality agents review annotations against rubrics, flag errors, and calculate quality scores",
// //         Expected_output: "Quality assessment reports with error detection and compliance scoring"
// //       },
// //       {
// //         Step_name: "Step 6: Rubric Compliance Check",
// //         Description: "Validate all annotations against defined rubric rules and escalate non-compliant items for review",
// //         Expected_output: "Compliance validation results with pass/fail status and escalation triggers"
// //       },
// //       {
// //         Step_name: "Step 7: Output to Storage",
// //         Description: "Push validated annotations, quality reports, and metadata back to cloud storage (Azure Blob/AWS S3)",
// //         Expected_output: "Final deliverables stored with complete audit trail and quality metrics"
// //       }
// //     ],
// //     Agents: [
// //       {
// //         Agent_name: "Bounding Box Agent",
// //         Role_description: "Responsible for creating, maintaining, and calibrating bounding boxes for annotation purposes to ensure consistent quality and compliance.",
// //         Skillset: [
// //           "Proficiency in annotation tools for bounding box creation",
// //           "Advanced knowledge of bounding box calibration techniques",
// //           "Expertise in estimating object boundaries in complex scenarios",
// //           "Data validation and annotation consistency"
// //         ],
// //         Domain_knowledge: [
// //           "Image and video annotation techniques",
// //           "Computer vision fundamentals",
// //           "Boundary estimation in occlusion conditions"
// //         ],
// //         Guidelines: [
// //           "1. Ensure bounding boxes persist across frames.",
// //           "4. Use consistent bounding box size across frames.",
// //           "14. Base bounding boxes on estimated boundaries for occluded faces.",
// //           "15. Draw head boxes based on estimated boundaries for occluded heads.",
// //           "24. Exclude appendages unless they overlap with head/torso.",
// //           "25. Exclude loose clothes and backpacks.",
// //           "35. Use consistent colors for each label.",
// //           "47. Draw bounding boxes around relevant entities.",
// //           "62. Define head as cranium to Adam's apple, even if inferred.",
// //           "63. Define clear criteria for bounding box calibration."
// //         ],
// //         Validations: [
// //           "Verify bounding box persistence over multiple frames.",
// //           "Ensure consistent size and calibration for bounding boxes.",
// //           "Check exclusion of irrelevant appendages and objects like backpacks.",
// //           "Validate color consistency for each bounding box label."
// //         ],
// //         Decision_points: [
// //           "If bounding box is inconsistent across frames → flagged for re-calibration.",
// //           "If occlusion estimation is unclear → escalate for human inspection.",
// //           "If box calibration errors occur → escalate to HIL."
// //         ],
// //         Sequence_position: 1,
// //         HIL_escalation_triggers: [
// //           "Overlapping bounding box issues",
// //           "Occlusion estimation errors",
// //           "Calibration inconsistencies"
// //         ]
// //       },
// //       {
// //         Agent_name: "Labeling Accuracy Agent",
// //         Role_description: "Ensures accurate labeling of faces, heads, and upper bodies under varying visibility conditions.",
// //         Skillset: [
// //           "Proficiency in visibility threshold analysis",
// //           "Domain knowledge of facial recognition features",
// //           "Annotation tag accuracy validation under partial visibility",
// //           "Advanced motion tracking in videos"
// //         ],
// //         Domain_knowledge: [
// //           "Best practices in facial and human labeling",
// //           "Partial visibility thresholds for annotation",
// //           "Handling overlap and ambiguity in label ownership"
// //         ],
// //         Guidelines: [
// //           "3. At least 20% of the upper body must be visible to be tagged.",
// //           "12. Do not label Face if fewer than 3 points are visible.",
// //           "13. Ensure differentiation of Face ownership is indicated.",
// //           "17. Annotate people, faces, heads, and upper bodies.",
// //           "20. Do not label faces with fewer than 3 visible points.",
// //           "21. Count points as visible if obscured by motion or video quality.",
// //           "33. If a face is partially blocked, annotate as Face if at least half visible.",
// //           "34. If head turns away, remove Face label if no facial features are visible.",
// //           "40. Annotate as Face if at least half visible; otherwise mark Head.",
// //           "42. Continue Head box; remove Face if no facial features visible.",
// //           "43. A person can have Face + Head + Upper Body boxes.",
// //           "65. Clarify how to handle overlapping tags.",
// //           "66. Define clear thresholds for when new Face labels are required.",
// //           "67. Clarify how to handle partially hidden humans.",
// //           "71. Define clear criteria for tagging partial visibility cases."
// //         ],
// //         Validations: [
// //           "Ensure all visibility thresholds are applied for each label.",
// //           "Validate differentiation for overlapping Face/Head/Body tags.",
// //           "Verify annotations under partial obstructions."
// //         ],
// //         Decision_points: [
// //           "If visibility confidence < threshold → flagged for HIL.",
// //           "If overlapping tags create ambiguity → escalate for review.",
// //           "If motion obscures visibility → request additional frame analysis."
// //         ],
// //         Sequence_position: 2,
// //         HIL_escalation_triggers: [
// //           "Low visibility score",
// //           "Tagging overlap inconsistencies",
// //           "Motion-related visibility problems"
// //         ]
// //       },
// //       {
// //         Agent_name: "Spoof Label Agent",
// //         Role_description: "Handles Spoof label application, reflection categorization, and identification of human-like objects to ensure accurate annotation.",
// //         Skillset: [
// //           "Spoof label tagging proficiency",
// //           "Expertise in reflection detection and classification",
// //           "Knowledge of human-like representation categorization",
// //           "Validation of real human identification"
// //         ],
// //         Domain_knowledge: [
// //           "Best practices in Spoof handling",
// //           "Human vs. non-human representation diagnostics",
// //           "Reflections and likeness labeling intricacies"
// //         ],
// //         Guidelines: [
// //           "5. Ensure Spoof label is applied only to real humans.",
// //           "6. Ensure no other objects are labeled as Spoof.",
// //           "7. Ensure all motion is tracked for Spoof labels.",
// //           "8. Ensure all occluded human figures are labeled as Spoof.",
// //           "9. Ensure no tags are applied to Spoof labels.",
// //           "22. Label reflections of faces as Face, tag Real Human = Yes.",
// //           "23. Label reflections of heads as Head, tag Real Human = Yes.",
// //           "27. Ensure all required objects are tagged, including human-like representations.",
// //           "28. Mark real human as Yes for Spoof and mirror reflection.",
// //           "29. Mark all others as No for real human indication.",
// //           "36. Label all non-hidden humans as spoofs.",
// //           "38. Label likenesses as Real Human = No.",
// //           "39. Label reflections as Real Human = Yes.",
// //           "41. Only label posters with faces as Spoof if actively used for spoofing.",
// //           "44. Do not label background objects unless directly used in spoof attempt.",
// //           "69. Clarify handling of ambiguous face/head reflections.",
// //           "73. Clarify how to handle ambiguous cases like partially visible spoof objects.",
// //           "75. Define clear criteria for identifying 'human-like' representations.",
// //           "76. Provide examples of 'Spoof' labels and their isolation process.",
// //           "77. Define clear criteria for occlusion in Spoof labeling."
// //         ],
// //         Validations: [
// //           "Ensure accurate application of Spoof label.",
// //           "Validate correct classification of reflections and human likenesses.",
// //           "Check occlusion handling for Spoof labels."
// //         ],
// //         Decision_points: [
// //           "If reflection classification is unclear → escalate for manual confirmation.",
// //           "If occlusion label criteria is uncertain → flagged for HIL.",
// //           "If human-like representation ambiguity detected → request additional investigation."
// //         ],
// //         Sequence_position: 3,
// //         HIL_escalation_triggers: [
// //           "Reflection classification issues",
// //           "Ambiguity in human-like object identification",
// //           "Conflicts in occlusion-based label application"
// //         ]
// //       },
// //       {
// //         Agent_name: "Playback and Annotation Agent",
// //         Role_description: "Ensures video playback, annotation tools usability, and consistent maintenance of workflow annotations.",
// //         Skillset: [
// //           "Expertise in video playback and annotation tools",
// //           "Knowledge of annotation workflow optimization techniques",
// //           "Proficiency in reviewing video scenes and detection behaviors",
// //           "Consistency checks across annotation edits"
// //         ],
// //         Domain_knowledge: [
// //           "Best practices in video annotation workflows",
// //           "Annotation tool usage and management",
// //           "Quality assessment for annotation consistency"
// //         ],
// //         Guidelines: [
// //           "16. Click lock to preserve label tag changes and prevent accidental edits.",
// //           "18. Update tag values as objects move through video.",
// //           "19. Add new Face labels for further rotations.",
// //           "45. Watch video fully before annotating.",
// //           "46. Load video in annotation tool before starting.",
// //           "48. Write 2–4 sentence scene descriptions.",
// //           "49. Review annotations for accuracy and consistency.",
// //           "51. Use zoom to label small faces but avoid frequent zoom changes.",
// //           "53. Pause and rewind frames when unsure.",
// //           "54. Double-check spoof detection carefully.",
// //           "55. Watch entire video to assess object capture and note major changes.",
// //           "56. Isolate 'Spoof' label by making other labels invisible.",
// //           "57. Play video to verify Spoof label application.",
// //           "58. Isolate Face label and play video to examine application.",
// //           "59. Ensure annotation tool supports video playback.",
// //           "60. Use playback speed option to review video faster.",
// //           "61. Understand scene context before annotating.",
// //           "64. Provide examples of high-quality scene descriptions.",
// //           "72. Provide examples of acceptable and unacceptable scene descriptions."
// //         ],
// //         Validations: [
// //           "Verify all annotations are locked to prevent unwanted edits.",
// //           "Check for scene descriptions quality and accuracy.",
// //           "Validate annotation tags throughout video playback."
// //         ],
// //         Decision_points: [
// //           "If scene description is ambiguous → flagged for HIL.",
// //           "If label consistency issues detected → escalate for review.",
// //           "If playback glitches occur → request additional tooling support."
// //         ],
// //         Sequence_position: 4,
// //         HIL_escalation_triggers: [
// //           "Scene description inaccuracies",
// //           "Annotation tag inconsistencies",
// //           "Playback glitches or errors"
// //         ]
// //       },
// //       {
// //         Agent_name: "Tagging Standards Agent",
// //         Role_description: "Focuses on systematic criteria and standardized tagging for accurate annotation.",
// //         Skillset: [
// //           "Proficiency in systematic tagging schema",
// //           "Advanced data layout and lighting analysis in video scenes",
// //           "Ability to validate Pose (Yaw and Pitch) tagging",
// //           "Knowledge in handling motion and video quality issues"
// //         ],
// //         Domain_knowledge: [
// //           "Facial feature and Pose labeling techniques",
// //           "Annotation layouts and systematic methodologies",
// //           "Motion-related annotation accuracy in low video quality scenarios"
// //         ],
// //         Guidelines: [
// //           "2. Exclude head/facial hair extending beyond head box.",
// //           "10. Ensure Face label is applied to all required objects.",
// //           "11. Ensure Face tags are accurate, including Pose and real human indication.",
// //           "26. Label IDs systematically (Face_1, Spoof_1, etc.).",
// //           "30. Create new label instances for changing tag values.",
// //           "31. Do not label cartoon heads.",
// //           "32. Clear glasses do not count as eye covering; sunglasses do.",
// //           "37. Tag yaw and pitch for face rotation.",
// //           "50. Check appropriate checkboxes for each tag.",
// //           "52. Describe layout, lighting, and spoof behavior factually.",
// //           "68. Define criteria for 'motion' and 'video quality' issues.",
// //           "70. Provide examples for yaw and pitch tagging.",
// //           "74. Provide examples of systematic labeling for complex scenarios.",
// //           "78. Standardize Pose (Yaw and Pitch) descriptions for Face labels."
// //         ],
// //         Validations: [
// //           "Ensure systematic labeling schema adherence.",
// //           "Validate Pose (Yaw and Pitch) accuracy.",
// //           "Verify tagging standards under varying video quality."
// //         ],
// //         Decision_points: [
// //           "If Pose tagging confidence < expectation → escalate for review.",
// //           "If motion complicates tagging accuracy → flagged for HIL.",
// //           "If lighting clarity is insufficient → request additional scene context."
// //         ],
// //         Sequence_position: 5,
// //         HIL_escalation_triggers: [
// //           "Yaw/Pitch tagging inconsistencies",
// //           "Motion-related tagging errors",
// //           "Lighting-related complexities in annotation"
// //         ]
// //       }
// //     ],
// //     Workflow_Summary: {
// //       Objective: "End-to-end quality assurance pipeline that ingests data from cloud storage, extracts guidelines, generates rubrics, coordinates human and AI annotation, validates quality, and outputs results back to storage with comprehensive audit trails",
// //       Key_phases: [
// //         "Data ingestion from Azure Blob/AWS S3",
// //         "AI-powered guideline extraction and rubric generation",
// //         "Parallel human and AI agent annotation",
// //         "Quality assessment and rubric validation",
// //         "Compliant output delivery to cloud storage"
// //       ],
// //       Final_outputs: [
// //         "Validated annotations with quality scores",
// //         "Comprehensive quality assessment reports",
// //         "Rubric compliance validation results",
// //         "Complete audit trail and metadata",
// //         "Final deliverables in cloud storage"
// //       ],
// //       Quality_assurance: "Multi-layer quality assurance with AI agents, human-in-the-loop validation, automated rubric checking, and error escalation workflows"
// //     },
// //     Guideline_coverage_verification: {
// //       Input_guidelines_count: 78,
// //       Output_guidelines_count: 78,
// //       Coverage_status: "COMPLETE - ALL GUIDELINES INCLUDED"
// //     }
// //   };

// //   const getAgentIcon = (agentName: string) => {
// //     switch (agentName) {
// //       case 'Bounding Box Agent': return <Target className="w-5 h-5 text-blue-500" />;
// //       case 'Labeling Accuracy Agent': return <Shield className="w-5 h-5 text-green-500" />;
// //       case 'Spoof Label Agent': return <FileCheck className="w-5 h-5 text-purple-500" />;
// //       case 'Playback and Annotation Agent': return <Database className="w-5 h-5 text-orange-500" />;
// //       case 'Tagging Standards Agent': return <Brain className="w-5 h-5 text-indigo-500" />;
// //       default: return <Bot className="w-5 h-5 text-gray-500" />;
// //     }
// //   };

// //   const getWorkflowStepIcon = (stepName: string) => {
// //     if (stepName.includes('Data Input')) return <Cloud className="w-6 h-6 text-blue-500" />;
// //     if (stepName.includes('Guideline Extraction')) return <Sparkles className="w-6 h-6 text-purple-500" />;
// //     if (stepName.includes('Rubric Generation')) return <ClipboardList className="w-6 h-6 text-green-500" />;
// //     if (stepName.includes('Annotation')) return <Users className="w-6 h-6 text-orange-500" />;
// //     if (stepName.includes('Quality Assessment')) return <BarChart3 className="w-6 h-6 text-pink-500" />;
// //     if (stepName.includes('Compliance')) return <CheckSquare className="w-6 h-6 text-indigo-500" />;
// //     if (stepName.includes('Output')) return <Download className="w-6 h-6 text-teal-500" />;
// //     return <CheckCircle className="w-6 h-6 text-gray-500" />;
// //   };

// //   const getWorkflowStepColor = (index: number) => {
// //     const colors = [
// //       'border-l-blue-500 bg-blue-50',
// //       'border-l-purple-500 bg-purple-50',
// //       'border-l-green-500 bg-green-50',
// //       'border-l-orange-500 bg-orange-50',
// //       'border-l-pink-500 bg-pink-50',
// //       'border-l-indigo-500 bg-indigo-50',
// //       'border-l-teal-500 bg-teal-50'
// //     ];
// //     return colors[index] || 'border-l-gray-500 bg-gray-50';
// //   };

// //   const handleDownloadWorkflow = () => {
// //     const dataStr = JSON.stringify(workflowData, null, 2);
// //     const dataBlob = new Blob([dataStr], { type: 'application/json' });
// //     const url = URL.createObjectURL(dataBlob);
// //     const link = document.createElement('a');
// //     link.href = url;
// //     link.download = 'workflow-data.json';
// //     document.body.appendChild(link);
// //     link.click();
// //     document.body.removeChild(link);
// //     URL.revokeObjectURL(url);
// //   };

// //   const handleApproveWorkflow = () => {
// //     setIsApproved(true);
// //     // You can add more logic here, like calling an API to save approval status
// //     setTimeout(() => {
// //       alert('Workflow approved successfully!');
// //     }, 100);
// //   };

// //   return (
// //     <div className="space-y-6">
// //       {/* Workflow Overview */}
// //       <Card>
// //         <CardHeader>
// //           <CardTitle className="flex items-center space-x-2">
// //             <Workflow className="w-5 h-5" />
// //             <span>{workflowData.Workflow_Overview.Workflow_name}</span>
// //           </CardTitle>
// //           <CardDescription>
// //             {workflowData.Workflow_Overview.Workflow_description}
// //           </CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
// //             <div className="p-4 border rounded-lg">
// //               <div className="flex items-center space-x-2 mb-2">
// //                 <Bot className="w-4 h-4 text-blue-500" />
// //                 <h4>Total Agents</h4>
// //               </div>
// //               <p className="font-bold">{workflowData.Workflow_Overview.Total_agents}</p>
// //             </div>
            
// //             <div className="p-4 border rounded-lg">
// //               <div className="flex items-center space-x-2 mb-2">
// //                 <FileCheck className="w-4 h-4 text-green-500" />
// //                 <h4>Guidelines Covered</h4>
// //               </div>
// //               <p className="font-bold">{workflowData.Workflow_Overview.Total_guidelines_covered}</p>
// //             </div>
// //           </div>
// //         </CardContent>
// //       </Card>

// //       {/* Workflow Summary */}
// //       <Card>
// //         <CardHeader>
// //           <CardTitle className="flex items-center space-x-2">
// //             <Workflow className="w-5 h-5" />
// //             <span>Workflow Summary</span>
// //           </CardTitle>
// //           <CardDescription>
// //             {workflowData.Workflow_Summary.Objective}
// //           </CardDescription>
// //         </CardHeader>
// //         <CardContent className="space-y-6">
// //           {/* Visual Flow Representation */}
// //           <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-blue-200">
// //             <div className="flex items-center space-x-3">
// //               <Cloud className="w-8 h-8 text-blue-500" />
// //               <div>
// //                 <p className="text-gray-700">Input Source</p>
// //                 <p className="text-gray-900">Azure Blob / AWS S3</p>
// //               </div>
// //             </div>
            
// //             <ArrowRight className="w-6 h-6 text-gray-400" />
            
// //             <div className="flex items-center space-x-3">
// //               <Sparkles className="w-8 h-8 text-purple-500" />
// //               <div>
// //                 <p className="text-gray-700">AI Processing</p>
// //                 <p className="text-gray-900">Guideline + Rubric</p>
// //               </div>
// //             </div>
            
// //             <ArrowRight className="w-6 h-6 text-gray-400" />
            
// //             <div className="flex items-center space-x-3">
// //               <Users className="w-8 h-8 text-orange-500" />
// //               <div>
// //                 <p className="text-gray-700">Annotation</p>
// //                 <p className="text-gray-900">Human + AI Agents</p>
// //               </div>
// //             </div>
            
// //             <ArrowRight className="w-6 h-6 text-gray-400" />
            
// //             <div className="flex items-center space-x-3">
// //               <BarChart3 className="w-8 h-8 text-pink-500" />
// //               <div>
// //                 <p className="text-gray-700">Quality Check</p>
// //                 <p className="text-gray-900">Assessment + Validation</p>
// //               </div>
// //             </div>
            
// //             <ArrowRight className="w-6 h-6 text-gray-400" />
            
// //             <div className="flex items-center space-x-3">
// //               <Download className="w-8 h-8 text-teal-500" />
// //               <div>
// //                 <p className="text-gray-700">Output Delivery</p>
// //                 <p className="text-gray-900">Cloud Storage</p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Key Phases and Outputs */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //             <div>
// //               <h5 className="mb-3 flex items-center space-x-2">
// //                 <GitBranch className="w-4 h-4 text-blue-500" />
// //                 <span>Key Phases</span>
// //               </h5>
// //               <div className="space-y-2">
// //                 {workflowData.Workflow_Summary.Key_phases.map((phase, idx) => (
// //                   <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-start space-x-3">
// //                     <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
// //                       {idx + 1}
// //                     </div>
// //                     <span className="text-gray-700">{phase}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
            
// //             <div>
// //               <h5 className="mb-3 flex items-center space-x-2">
// //                 <FileCheck className="w-4 h-4 text-green-500" />
// //                 <span>Final Deliverables</span>
// //               </h5>
// //               <div className="space-y-2">
// //                 {workflowData.Workflow_Summary.Final_outputs.map((output, idx) => (
// //                   <div key={idx} className="flex items-start space-x-2">
// //                     <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
// //                     <span className="text-gray-700">{output}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         </CardContent>
// //       </Card>

// //       {/* Workflow Header Section with Action Buttons */}
// //       <Card>
// //         <CardContent className="pt-6">
// //           <div className="flex items-start justify-between">
// //             <div className="flex items-start space-x-3">
// //               <Play className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
// //               <div>
// //                 <h3 className="text-lg font-semibold text-gray-900 mb-1">
// //                   Video Annotation Workflow
// //                 </h3>
// //                 <p className="text-gray-600">
// //                   End-to-end annotation workflow for video content based on guideline requirements
// //                 </p>
// //               </div>
// //             </div>
// //             <div className="flex items-center space-x-3">
// //               <Button 
// //                 variant="outline" 
// //                 className="flex items-center space-x-2"
// //                 onClick={handleDownloadWorkflow}
// //               >
// //                 <Download className="w-4 h-4" />
// //                 <span>Download Workflow</span>
// //               </Button>
// //               <Button 
// //                 variant="outline"
// //                 className={`flex items-center space-x-2 ${isApproved ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'}`}
// //                 onClick={handleApproveWorkflow}
// //                 disabled={isApproved}
// //               >
// //                 <CheckCircle className="w-4 h-4" />
// //                 <span>Approve</span>
// //               </Button>
// //             </div>
// //           </div>
// //         </CardContent>
// //       </Card>

// //       {/* Tabs for Workflow Process and Agents */}
// //       <Tabs value={workflowTab} onValueChange={setWorkflowTab} className="w-full">
// //         <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
// //           <TabsTrigger value="process" className="flex items-center space-x-2 px-6">
// //             <List className="w-4 h-4" />
// //             <span>Workflow Process</span>
// //           </TabsTrigger>
// //           <TabsTrigger value="agents" className="flex items-center space-x-2 px-6">
// //             <Bot className="w-4 h-4" />
// //             <span>Agents</span>
// //           </TabsTrigger>
// //         </TabsList>

// //         {/* Workflow Process Tab */}
// //         <TabsContent value="process" className="space-y-6 mt-6">
// //           <Card>
// //             <CardHeader>
// //               <CardTitle className="flex items-center space-x-2">
// //                 <List className="w-5 h-5" />
// //                 <span>Workflow Process</span>
// //               </CardTitle>
// //               <CardDescription>
// //                 Sequential steps in the annotation workflow
// //               </CardDescription>
// //             </CardHeader>
// //             <CardContent>
// //               <div className="space-y-4">
// //                 {/* Phase 1: Preparation & Initial Review */}
// //                 <Card className="border-2">
// //                   <CardContent className="pt-4">
// //                     <div className="flex items-start space-x-4">
// //                       <div className="flex-shrink-0">
// //                         <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-semibold">
// //                           1
// //                         </div>
// //                       </div>
// //                       <div className="flex-1">
// //                         <h4 className="font-semibold text-gray-900 mb-3">Preparation & Initial Review</h4>
// //                         <div className="space-y-2">
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Load video in annotation tool and ensure playback functionality</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Watch entire video to understand scene context, assess complexity, and identify all human subjects</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Write 2-4 sentence scene description covering layout, lighting, and spoof behavior</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Note challenging conditions: occlusion, motion blur, poor lighting, reflections</p>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </CardContent>
// //                 </Card>

// //                 <div className="flex justify-center">
// //                   <ArrowDown className="w-5 h-5 text-gray-400" />
// //                 </div>

// //                 {/* Phase 2: Initial Frame Bounding Box Creation */}
// //                 <Card className="border-2">
// //                   <CardContent className="pt-4">
// //                     <div className="flex items-start space-x-4">
// //                       <div className="flex-shrink-0">
// //                         <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white font-semibold">
// //                           2
// //                         </div>
// //                       </div>
// //                       <div className="flex-1">
// //                         <h4 className="font-semibold text-gray-900 mb-3">Initial Frame Bounding Box Creation</h4>
// //                         <div className="space-y-2">
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Start with first frame where subjects are clearly visible</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Create tight bounding boxes around each face from cranium to Adam's apple</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Draw head bounding boxes using estimated boundaries for occluded regions</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Create upper body boxes from head to hip line, excluding loose clothing and backpacks</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Assign unique entity IDs to each subject for tracking across frames</p>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </CardContent>
// //                 </Card>

// //                 <div className="flex justify-center">
// //                   <ArrowDown className="w-5 h-5 text-gray-400" />
// //                 </div>

// //                 {/* Phase 3: Initial Labeling */}
// //                 <Card className="border-2">
// //                   <CardContent className="pt-4">
// //                     <div className="flex items-start space-x-4">
// //                       <div className="flex-shrink-0">
// //                         <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white font-semibold">
// //                           3
// //                         </div>
// //                       </div>
// //                       <div className="flex-1">
// //                         <h4 className="font-semibold text-gray-900 mb-3">Initial Labeling</h4>
// //                         <div className="space-y-2">
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Apply Face label when entire face (eyes, nose, mouth) is visible with 51%+ visibility</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Apply Head label when head is visible but face criteria not met</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Apply Upper Body label when torso from shoulders to hips is visible</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Use consistent colors for each label type across all frames</p>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </CardContent>
// //                 </Card>

// //                 <div className="flex justify-center">
// //                   <ArrowDown className="w-5 h-5 text-gray-400" />
// //                 </div>

// //                 {/* Phase 4: Spoof Label Assignment */}
// //                 <Card className="border-2">
// //                   <CardContent className="pt-4">
// //                     <div className="flex items-start space-x-4">
// //                       <div className="flex-shrink-0">
// //                         <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-600 text-white font-semibold">
// //                           4
// //                         </div>
// //                       </div>
// //                       <div className="flex-1">
// //                         <h4 className="font-semibold text-gray-900 mb-3">Spoof Label Assignment</h4>
// //                         <div className="space-y-2">
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Identify spoof media: printed photos, digital screens, masks, or 3D models</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Apply spoof label to faces shown on paper, screens, or other media</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Document spoof type in annotations (photo, video playback, mask, etc.)</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Maintain separate entity IDs for spoofed subjects vs real humans</p>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </CardContent>
// //                 </Card>

// //                 <div className="flex justify-center">
// //                   <ArrowDown className="w-5 h-5 text-gray-400" />
// //                 </div>

// //                 {/* Phase 5: Tag Application & Validation */}
// //                 <Card className="border-2">
// //                   <CardContent className="pt-4">
// //                     <div className="flex items-start space-x-4">
// //                       <div className="flex-shrink-0">
// //                         <div className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-600 text-white font-semibold">
// //                           5
// //                         </div>
// //                       </div>
// //                       <div className="flex-1">
// //                         <h4 className="font-semibold text-gray-900 mb-3">Tag Application & Validation</h4>
// //                         <div className="space-y-2">
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Add pose angle tags: frontal (±15°), profile (±75°), or other angles</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Tag ownership status: owned (user's device) or unowned (bystanders, environment)</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Mark real human status to distinguish actual people from spoof media</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Verify tag accuracy by reviewing against video context</p>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </CardContent>
// //                 </Card>

// //                 <div className="flex justify-center">
// //                   <ArrowDown className="w-5 h-5 text-gray-400" />
// //                 </div>

// //                 {/* Phase 6: Quality Review & Validation */}
// //                 <Card className="border-2">
// //                   <CardContent className="pt-4">
// //                     <div className="flex items-start space-x-4">
// //                       <div className="flex-shrink-0">
// //                         <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold">
// //                           6
// //                         </div>
// //                       </div>
// //                       <div className="flex-1">
// //                         <h4 className="font-semibold text-gray-900 mb-3">Quality Review & Validation</h4>
// //                         <div className="space-y-2">
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Isolate Face labels and play video to examine proper application</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Review annotations for accuracy, consistency, and guideline compliance</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Verify all entity IDs maintain continuity throughout the video</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Check visibility thresholds are properly met for all labels</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Validate all tags are accurate (pose angles, ownership, real human status)</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Use zoom feature to verify small faces are properly labeled</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Watch entire video again to assess object capture and note major changes</p>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </CardContent>
// //                 </Card>

// //                 <div className="flex justify-center">
// //                   <ArrowDown className="w-5 h-5 text-gray-400" />
// //                 </div>

// //                 {/* Phase 7: Finalization & Submission */}
// //                 <Card className="border-2">
// //                   <CardContent className="pt-4">
// //                     <div className="flex items-start space-x-4">
// //                       <div className="flex-shrink-0">
// //                         <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-600 text-white font-semibold">
// //                           7
// //                         </div>
// //                       </div>
// //                       <div className="flex-1">
// //                         <h4 className="font-semibold text-gray-900 mb-3">Finalization & Submission</h4>
// //                         <div className="space-y-2">
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Click lock icon to preserve all label tag changes and prevent accidental edits</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Document any edge cases, uncertainties, or ambiguous scenarios in comments</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Verify scene description is complete and factual</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Final check for bounding box consistency and frame-by-frame accuracy</p>
// //                           </div>
// //                           <div className="flex items-start space-x-2">
// //                             <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
// //                             <p className="text-gray-700">Submit completed annotation for QA review</p>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </CardContent>
// //                 </Card>

// //                 {/* Completion Badge */}
// //                 <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-lg">
// //                   <div className="flex items-center justify-between">
// //                     <div className="flex items-start space-x-3">
// //                       <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
// //                       <div>
// //                         <h4 className="font-semibold text-green-900 mb-1">Annotation Workflow Complete</h4>
// //                         <p className="text-green-700">
// //                           Video annotation ready for quality assurance review with all guidelines applied and validated
// //                         </p>
// //                       </div>
// //                     </div>
// //                     <Badge className="bg-green-600">
// //                       Ready for QA
// //                     </Badge>
// //                   </div>
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         </TabsContent>

// //         {/* Agents Tab */}
// //         <TabsContent value="agents" className="space-y-6 mt-6">
// //           <Card>
// //             <CardHeader>
// //               <CardTitle className="flex items-center space-x-2">
// //                 <Bot className="w-5 h-5" />
// //                 <span>Agents</span>
// //               </CardTitle>
// //               <CardDescription>
// //                 Multi-agent execution sequence through the workflow
// //               </CardDescription>
// //             </CardHeader>
// //             <CardContent>
// //               <div className="space-y-4">
// //                 {workflowData.Agents.map((agent, index) => (
// //                   <div key={agent.Agent_name}>
// //                     {/* Agent Card */}
// //                     <Card className="border-2 hover:shadow-md transition-shadow">
// //                       <CardHeader className="pb-3">
// //                         <div className="flex items-center justify-between">
// //                           <div className="flex items-center space-x-3">
// //                             <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-semibold">
// //                               {agent.Sequence_position}
// //                             </div>
// //                             {getAgentIcon(agent.Agent_name)}
// //                             <div>
// //                               <CardTitle className="text-base">
// //                                 {agent.Agent_name}
// //                               </CardTitle>
// //                             </div>
// //                           </div>
// //                           <Badge variant="outline">
// //                             {agent.Guidelines.length} guidelines
// //                           </Badge>
// //                         </div>
// //                       </CardHeader>
                      
// //                       <CardContent className="pt-0">
// //                         <p className="text-sm text-gray-600 mb-4">
// //                           {agent.Role_description}
// //                         </p>
                        
// //                         {/* Core Capabilities */}
// //                         <div className="mb-4">
// //                           <h6 className="text-sm font-semibold mb-2 flex items-center space-x-2 text-gray-700">
// //                             <Brain className="w-4 h-4 text-blue-500" />
// //                             <span>Core Capabilities</span>
// //                           </h6>
// //                           <div className="space-y-2">
// //                             {agent.Skillset.map((skill, idx) => (
// //                               <div key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
// //                                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
// //                                 <span>{skill}</span>
// //                               </div>
// //                             ))}
// //                           </div>
// //                         </div>

// //                         {/* Domain Knowledge */}
// //                         <div className="mb-4">
// //                           <h6 className="text-sm font-semibold mb-2 flex items-center space-x-2 text-gray-700">
// //                             <Database className="w-4 h-4 text-purple-500" />
// //                             <span>Domain Knowledge</span>
// //                           </h6>
// //                           <div className="space-y-2">
// //                             {agent.Domain_knowledge.map((knowledge, idx) => (
// //                               <div key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
// //                                 <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
// //                                 <span>{knowledge}</span>
// //                               </div>
// //                             ))}
// //                           </div>
// //                         </div>

// //                         {/* Guidelines */}
// //                         <div className="mb-4">
// //                           <h6 className="text-sm font-semibold mb-2 flex items-center space-x-2 text-gray-700">
// //                             <FileCheck className="w-4 h-4 text-green-500" />
// //                             <span>Guidelines ({agent.Guidelines.length})</span>
// //                           </h6>
// //                           <div className="text-sm text-gray-600 space-y-2">
// //                             {agent.Guidelines.map((guideline, idx) => (
// //                               <div key={idx} className="flex items-start space-x-2">
// //                                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
// //                                 <span>{guideline}</span>
// //                               </div>
// //                             ))}
// //                           </div>
// //                         </div>

// //                         {/* Validations */}
// //                         <div className="mb-4">
// //                           <h6 className="text-sm font-semibold mb-2 flex items-center space-x-2 text-gray-700">
// //                             <Shield className="w-4 h-4 text-indigo-500" />
// //                             <span>Validations</span>
// //                           </h6>
// //                           <div className="space-y-2">
// //                             {agent.Validations.map((validation, idx) => (
// //                               <div key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
// //                                 <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
// //                                 <span>{validation}</span>
// //                               </div>
// //                             ))}
// //                           </div>
// //                         </div>

// //                         {/* Decision Points */}
// //                         <div className="mb-4">
// //                           <h6 className="text-sm font-semibold mb-2 flex items-center space-x-2 text-gray-700">
// //                             <Target className="w-4 h-4 text-orange-500" />
// //                             <span>Decision Points</span>
// //                           </h6>
// //                           <div className="space-y-2">
// //                             {agent.Decision_points.map((decision, idx) => (
// //                               <div key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
// //                                 <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
// //                                 <span>{decision}</span>
// //                               </div>
// //                             ))}
// //                           </div>
// //                         </div>

// //                         {/* HIL Escalation Triggers */}
// //                         <div className="bg-red-50 border border-red-200 rounded-lg p-3">
// //                           <h6 className="text-sm font-semibold mb-2 flex items-center space-x-2 text-red-700">
// //                             <AlertTriangle className="w-4 h-4 text-red-500" />
// //                             <span>HIL Escalation Triggers</span>
// //                           </h6>
// //                           <div className="space-y-2">
// //                             {agent.HIL_escalation_triggers.map((trigger, idx) => (
// //                               <div key={idx} className="text-sm text-red-700 flex items-start space-x-2">
// //                                 <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
// //                                 <span>{trigger}</span>
// //                               </div>
// //                             ))}
// //                           </div>
// //                         </div>
// //                       </CardContent>
// //                     </Card>
                    
// //                     {/* Arrow between agents */}
// //                     {index < workflowData.Agents.length - 1 && (
// //                       <div className="flex justify-center my-4">
// //                         <div className="flex flex-col items-center">
// //                           <ArrowDown className="w-6 h-6 text-blue-500" />
// //                           <span className="text-sm text-gray-500 mt-1">Next Agent</span>
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>
// //                 ))}
// //               </div>
// //             </CardContent>
// //           </Card>
// //         </TabsContent>
// //       </Tabs>
// //     </div>
// //   );
// // }


// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
// import { Button } from './ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// import { 
//   Workflow, 
//   Play, 
//   Pause, 
//   CheckCircle,
//   ArrowDown,
//   ArrowRight,
//   Settings,
//   Target,
//   Shield,
//   Brain,
//   Database,
//   FileCheck,
//   AlertTriangle,
//   Bot,
//   GitBranch,
//   List,
//   Upload,
//   Download,
//   Sparkles,
//   ClipboardList,
//   Users,
//   BarChart3,
//   CheckSquare,
//   Cloud
// } from 'lucide-react';
// import { useState, useEffect } from 'react';

// const API_BASE = '/api';

// interface WorkflowAgent {
//   Agent_name: string;
//   Role_description: string;
//   Skillset: string[];
//   Domain_knowledge: string[];
//   Guidelines: string[];
//   Validations: string[];
//   Decision_points: string[];
//   Sequence_position: number;
//   HIL_escalation_triggers: string[];
// }

// interface WorkflowStep {
//   Step_name: string;
//   Description: string;
//   Annotator_actions?: string[];
//   Agent_involvement?: string;
//   Expected_output: string;
//   Quality_gates?: string[];
// }

// interface WorkflowData {
//   Workflow_Overview: {
//     Workflow_name: string;
//     Total_agents: number;
//     Total_guidelines_covered: number;
//     Workflow_description: string;
//     Execution_sequence: string[];
//     Validation_framework: string;
//   };
//   Workflow_Process: WorkflowStep[];
//   Agents: WorkflowAgent[];
//   Workflow_Summary: {
//     Workflow_name?: string;
//     End_to_end_process?: string;
//     Final_deliverables?: string[];
//     Objective: string;
//     Key_phases: string[];
//     Final_outputs?: string[];
//     Quality_assurance?: string;
//     Quality_assurance_approach?: string;
//   };
//   Guideline_coverage_verification?: {
//     Input_guidelines_count: number;
//     Output_guidelines_count: number;
//     Coverage_status: string;
//   };
// }

// type Props = {
//   sessionId?: string | null;
//   onWorkflowGenerated?: () => void;
// };

// export function WorkflowManagement({ sessionId, onWorkflowGenerated }: Props) {
//   const [workflowTab, setWorkflowTab] = useState('process');
//   const [isApproved, setIsApproved] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [generating, setGenerating] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null);

//   // Load workflow data when sessionId changes
//   useEffect(() => {
//     if (sessionId) {
//       loadWorkflow();
//     }
//   }, [sessionId]);

//   const loadWorkflow = async () => {
//     if (!sessionId) return;
    
//     setLoading(true);
//     setError(null);
    
//     try {
//       const res = await fetch(`${API_BASE}/workflow/${sessionId}`);
//       if (!res.ok) throw new Error('Failed to load workflow');
      
//       const data = await res.json();
//       if (data.workflow) {
//         setWorkflowData(data.workflow);
//       }
//     } catch (e: any) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGenerateWorkflow = async () => {
//     if (!sessionId) {
//       setError('Please complete extraction first');
//       return;
//     }
    
//     setGenerating(true);
//     setError(null);
    
//     try {
//       const res = await fetch(`${API_BASE}/workflow/${sessionId}/generate`, {
//         method: 'POST'
//       });
      
//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.detail || 'Failed to generate workflow');
//       }
      
//       const data = await res.json();
//       setWorkflowData(data.workflow);
//       onWorkflowGenerated?.();
      
//     } catch (e: any) {
//       setError(e.message);
//     } finally {
//       setGenerating(false);
//     }
//   };


//   const handleDownloadWorkflow = () => {
//     if (!workflowData) return;
//     const dataStr = JSON.stringify(workflowData, null, 2);
//     const dataBlob = new Blob([dataStr], { type: 'application/json' });
//     const url = URL.createObjectURL(dataBlob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'workflow-data.json';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

//   const handleApproveWorkflow = () => {
//     setIsApproved(true);
//     setTimeout(() => {
//       alert('Workflow approved successfully!');
//     }, 100);
//   };

//   const getAgentIcon = (agentName: string) => {
//     switch (agentName) {
//       case 'Bounding Box Agent': return <Target className="w-5 h-5 text-blue-500" />;
//       case 'Labeling Accuracy Agent': return <Shield className="w-5 h-5 text-green-500" />;
//       case 'Spoof Label Agent': return <FileCheck className="w-5 h-5 text-purple-500" />;
//       case 'Playback and Annotation Agent': return <Database className="w-5 h-5 text-orange-500" />;
//       case 'Tagging Standards Agent': return <Brain className="w-5 h-5 text-indigo-500" />;
//       default: return <Bot className="w-5 h-5 text-gray-500" />;
//     }
//   };

//   const getWorkflowStepIcon = (stepName: string) => {
//     if (stepName.includes('Data Input')) return <Cloud className="w-6 h-6 text-blue-500" />;
//     if (stepName.includes('Guideline Extraction')) return <Sparkles className="w-6 h-6 text-purple-500" />;
//     if (stepName.includes('Rubric Generation')) return <ClipboardList className="w-6 h-6 text-green-500" />;
//     if (stepName.includes('Annotation')) return <Users className="w-6 h-6 text-orange-500" />;
//     if (stepName.includes('Quality Assessment')) return <BarChart3 className="w-6 h-6 text-pink-500" />;
//     if (stepName.includes('Compliance')) return <CheckSquare className="w-6 h-6 text-indigo-500" />;
//     if (stepName.includes('Output')) return <Download className="w-6 h-6 text-teal-500" />;
//     return <CheckCircle className="w-6 h-6 text-gray-500" />;
//   };

//   const getWorkflowStepColor = (index: number) => {
//     const colors = [
//       'border-l-blue-500 bg-blue-50',
//       'border-l-purple-500 bg-purple-50',
//       'border-l-green-500 bg-green-50',
//       'border-l-orange-500 bg-orange-50',
//       'border-l-pink-500 bg-pink-50',
//       'border-l-indigo-500 bg-indigo-50',
//       'border-l-teal-500 bg-teal-50'
//     ];
//     return colors[index] || 'border-l-gray-500 bg-gray-50';
//   };

//   return (
//     <div className="space-y-6">
//       {/* Generate Workflow Button and Status */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex items-center gap-3 mb-4">
//             <Button 
//               onClick={handleGenerateWorkflow} 
//               disabled={!sessionId || generating || loading}
//             >
//               {generating ? 'Generating Workflow...' : 'Generate Workflow from Guidelines'}
//             </Button>
            
//             <Button 
//               variant="outline" 
//               onClick={loadWorkflow}
//               disabled={!sessionId || loading}
//             >
//               Refresh
//             </Button>
            
//             {!sessionId && (
//               <span className="text-xs text-red-600">Complete extraction first</span>
//             )}
//           </div>

//           {error && (
//             <div className="text-sm text-red-600 bg-red-50 p-3 rounded mb-4">
//               {error}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {loading ? (
//         <div className="text-center py-8 text-gray-600">Loading workflow...</div>
//       ) : !workflowData ? (
//         <div className="text-center py-8 text-gray-600">
//           No workflow yet. Click "Generate Workflow from Guidelines" to create it automatically.
//         </div>
//       ) : (
//         <>
//           {/* Workflow Overview */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <Workflow className="w-5 h-5" />
//                 <span>{workflowData.Workflow_Overview.Workflow_name}</span>
//               </CardTitle>
//               <CardDescription>
//                 {workflowData.Workflow_Overview.Workflow_description}
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                 <div className="p-4 border rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <Bot className="w-4 h-4 text-blue-500" />
//                     <h4>Total Agents</h4>
//                   </div>
//                   <p className="font-bold">{workflowData.Workflow_Overview.Total_agents}</p>
//                 </div>
                
//                 <div className="p-4 border rounded-lg">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <FileCheck className="w-4 h-4 text-green-500" />
//                     <h4>Guidelines Covered</h4>
//                   </div>
//                   <p className="font-bold">{workflowData.Workflow_Overview.Total_guidelines_covered}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Workflow Summary */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <Workflow className="w-5 h-5" />
//                 <span>Workflow Summary</span>
//               </CardTitle>
//               <CardDescription>
//                 {workflowData.Workflow_Summary.Objective}
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Visual Flow Representation */}
//               <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-blue-200">
//                 <div className="flex items-center space-x-3">
//                   <Cloud className="w-8 h-8 text-blue-500" />
//                   <div>
//                 <p className="text-gray-700">Input Source</p>
//                 <p className="text-gray-900">Azure Blob / AWS S3</p>
//               </div>
//             </div>
            
//             <ArrowRight className="w-6 h-6 text-gray-400" />
            
//             <div className="flex items-center space-x-3">
//               <Sparkles className="w-8 h-8 text-purple-500" />
//               <div>
//                 <p className="text-gray-700">AI Processing</p>
//                 <p className="text-gray-900">Guideline + Rubric</p>
//               </div>
//             </div>
            
//             <ArrowRight className="w-6 h-6 text-gray-400" />
            
//             <div className="flex items-center space-x-3">
//               <Users className="w-8 h-8 text-orange-500" />
//               <div>
//                 <p className="text-gray-700">Annotation</p>
//                 <p className="text-gray-900">Human + AI Agents</p>
//               </div>
//             </div>
            
//             <ArrowRight className="w-6 h-6 text-gray-400" />
            
//             <div className="flex items-center space-x-3">
//               <BarChart3 className="w-8 h-8 text-pink-500" />
//               <div>
//                 <p className="text-gray-700">Quality Check</p>
//                 <p className="text-gray-900">Assessment + Validation</p>
//               </div>
//             </div>
            
//             <ArrowRight className="w-6 h-6 text-gray-400" />
            
//             <div className="flex items-center space-x-3">
//               <Download className="w-8 h-8 text-teal-500" />
//               <div>
//                 <p className="text-gray-700">Output Delivery</p>
//                 <p className="text-gray-900">Cloud Storage</p>
//               </div>
//             </div>
//           </div>

//           {/* Key Phases and Outputs */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h5 className="mb-3 flex items-center space-x-2">
//                 <GitBranch className="w-4 h-4 text-blue-500" />
//                 <span>Key Phases</span>
//               </h5>
//               <div className="space-y-2">
//                 {workflowData.Workflow_Summary.Key_phases.map((phase, idx) => (
//                   <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-start space-x-3">
//                     <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
//                       {idx + 1}
//                     </div>
//                     <span className="text-gray-700">{phase}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
            
//             {(workflowData.Workflow_Summary.Final_outputs || workflowData.Workflow_Summary.Final_deliverables) && (
//               <div>
//                 <h5 className="mb-3 flex items-center space-x-2">
//                   <FileCheck className="w-4 h-4 text-green-500" />
//                   <span>Final Deliverables</span>
//                 </h5>
//                 <div className="space-y-2">
//                   {(workflowData.Workflow_Summary.Final_outputs || workflowData.Workflow_Summary.Final_deliverables || []).map((output, idx) => (
//                     <div key={idx} className="flex items-start space-x-2">
//                       <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//                       <span className="text-gray-700">{output}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Workflow Header Section with Action Buttons */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex items-start justify-between">
//             <div className="flex items-start space-x-3">
//               <Play className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-1">
//                   Video Annotation Workflow
//                 </h3>
//                 <p className="text-gray-600">
//                   End-to-end annotation workflow for video content based on guideline requirements
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-3">
//               <Button 
//                 variant="outline" 
//                 className="flex items-center space-x-2"
//                 onClick={handleDownloadWorkflow}
//               >
//                 <Download className="w-4 h-4" />
//                 <span>Download Workflow</span>
//               </Button>
//               <Button 
//                 variant="outline"
//                 className={`flex items-center space-x-2 ${isApproved ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'}`}
//                 onClick={handleApproveWorkflow}
//                 disabled={isApproved}
//               >
//                 <CheckCircle className="w-4 h-4" />
//                 <span>Approve</span>
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Tabs for Workflow Process and Agents */}
//       <Tabs value={workflowTab} onValueChange={setWorkflowTab} className="w-full">
//         <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
//           <TabsTrigger value="process" className="flex items-center space-x-2 px-6">
//             <List className="w-4 h-4" />
//             <span>Workflow Process</span>
//           </TabsTrigger>
//           <TabsTrigger value="agents" className="flex items-center space-x-2 px-6">
//             <Bot className="w-4 h-4" />
//             <span>Agents</span>
//           </TabsTrigger>
//         </TabsList>

//         {/* Workflow Process Tab */}
//         <TabsContent value="process" className="space-y-6 mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <List className="w-5 h-5" />
//                 <span>Workflow Process</span>
//               </CardTitle>
//               <CardDescription>
//                 Sequential steps in the annotation workflow
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {workflowData.Workflow_Process.map((step, index) => {
//                   const colors = [
//                     { bg: 'bg-blue-600', text: 'text-blue-600' },
//                     { bg: 'bg-green-600', text: 'text-green-600' },
//                     { bg: 'bg-purple-600', text: 'text-purple-600' },
//                     { bg: 'bg-orange-600', text: 'text-orange-600' },
//                     { bg: 'bg-pink-600', text: 'text-pink-600' },
//                     { bg: 'bg-indigo-600', text: 'text-indigo-600' },
//                     { bg: 'bg-teal-600', text: 'text-teal-600' }
//                   ];
//                   const color = colors[index % colors.length];
                  
//                   return (
//                     <div key={index}>
//                       <Card className="border-2">
//                         <CardContent className="pt-4">
//                           <div className="flex items-start space-x-4">
//                             <div className="flex-shrink-0">
//                               <div className={`flex items-center justify-center w-10 h-10 rounded-full ${color.bg} text-white font-semibold`}>
//                                 {index + 1}
//                               </div>
//                             </div>
//                             <div className="flex-1">
//                               <h4 className="font-semibold text-gray-900 mb-3">{step.Step_name}</h4>
//                               <p className="text-gray-700 mb-3">{step.Description}</p>
                              
//                               {/* Annotator Actions */}
//                               {step.Annotator_actions && step.Annotator_actions.length > 0 && (
//                                 <div className="mb-3">
//                                   <h5 className="text-sm font-semibold text-gray-700 mb-2">Annotator Actions:</h5>
//                                   <div className="space-y-2">
//                                     {step.Annotator_actions.map((action, idx) => (
//                                       <div key={idx} className="flex items-start space-x-2">
//                                         <CheckCircle className={`w-4 h-4 ${color.text} mt-0.5 flex-shrink-0`} />
//                                         <p className="text-gray-700 text-sm">{action}</p>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                               )}
                              
//                               {/* Agent Involvement */}
//                               {step.Agent_involvement && (
//                                 <div className="mb-3 bg-blue-50 border-2 border-blue-300 border-l-4 border-l-blue-500 rounded-lg p-3">
//                                   <p className="text-sm">
//                                     <span className="font-medium text-blue-900">Agent Involvement:</span>{' '}
//                                     <span className="text-blue-800">{step.Agent_involvement}</span>
//                                   </p>
//                                 </div>
//                               )}
                              
//                               {/* Expected Output */}
//                               <div className="mb-3 bg-green-50 border-2 border-green-300 border-l-4 border-l-green-500 rounded-lg p-3">
//                                 <p className="text-sm">
//                                   <span className="font-medium text-green-900">Expected Output:</span>{' '}
//                                   <span className="text-green-800">{step.Expected_output}</span>
//                                 </p>
//                               </div>
                              
//                               {/* Quality Gates */}
//                               {step.Quality_gates && step.Quality_gates.length > 0 && (
//                                 <div className="bg-purple-50 border-2 border-purple-300 border-l-4 border-l-purple-500 rounded-lg p-3">
//                                   <h5 className="text-sm font-semibold text-purple-900 mb-2">Quality Gates:</h5>
//                                   <div className="space-y-1">
//                                     {step.Quality_gates.map((gate, idx) => (
//                                       <div key={idx} className="flex items-start space-x-2">
//                                         <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
//                                         <p className="text-sm text-purple-800">{gate}</p>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
                      
//                       {/* Arrow between steps */}
//                       {index < workflowData.Workflow_Process.length - 1 && (
//                         <div className="flex justify-center my-3">
//                           <ArrowDown className="w-5 h-5 text-gray-400" />
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}

//                 {/* Workflow Completion Badge */}
//                 <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-lg">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-start space-x-3">
//                       <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
//                       <div>
//                         <h4 className="font-semibold text-green-900 mb-1">Workflow Process Complete</h4>
//                         <p className="text-green-700">
//                           All workflow steps defined with quality gates and validation checkpoints
//                         </p>
//                       </div>
//                     </div>
//                     <Badge className="bg-green-600">
//                       {workflowData.Workflow_Process.length} Steps
//                     </Badge>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Agents Tab */}
//         <TabsContent value="agents" className="space-y-6 mt-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center space-x-2">
//                 <Bot className="w-5 h-5" />
//                 <span>Agents</span>
//               </CardTitle>
//               <CardDescription>
//                 Multi-agent execution sequence through the workflow
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {workflowData.Agents.map((agent, index) => (
//                   <div key={agent.Agent_name}>
//                     {/* Agent Card */}
//                     <Card className="border-2 hover:shadow-md transition-shadow">
//                       <CardHeader className="pb-3">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center space-x-3">
//                             <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-semibold">
//                               {agent.Sequence_position}
//                             </div>
//                             {getAgentIcon(agent.Agent_name)}
//                             <div>
//                               <CardTitle className="text-base">
//                                 {agent.Agent_name}
//                               </CardTitle>
//                             </div>
//                           </div>
//                           <Badge variant="outline">
//                             {agent.Guidelines.length} guidelines
//                           </Badge>
//                         </div>
//                       </CardHeader>
                      
//                       <CardContent className="pt-0">
//                         <p className="text-sm text-gray-600 mb-4">
//                           {agent.Role_description}
//                         </p>
                        
//                         {/* Core Capabilities */}
//                         <div className="mb-4">
//                           <h6 className="text-sm font-semibold mb-2 flex items-center space-x-2 text-gray-700">
//                             <Brain className="w-4 h-4 text-blue-500" />
//                             <span>Core Capabilities</span>
//                           </h6>
//                           <div className="space-y-2">
//                             {agent.Skillset.map((skill, idx) => (
//                               <div key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
//                                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
//                                 <span>{skill}</span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         {/* Domain Knowledge */}
//                         <div className="mb-4">
//                           <h6 className="text-sm font-semibold mb-2 flex items-center space-x-2 text-gray-700">
//                             <Database className="w-4 h-4 text-purple-500" />
//                             <span>Domain Knowledge</span>
//                           </h6>
//                           <div className="space-y-2">
//                             {agent.Domain_knowledge.map((knowledge, idx) => (
//                               <div key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
//                                 <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
//                                 <span>{knowledge}</span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         {/* Guidelines */}
//                         <div className="mb-4">
//                           <h6 className="text-sm font-semibold mb-2 flex items-center space-x-2 text-gray-700">
//                             <FileCheck className="w-4 h-4 text-green-500" />
//                             <span>Guidelines ({agent.Guidelines.length})</span>
//                           </h6>
//                           <div className="text-sm text-gray-600 space-y-2">
//                             {agent.Guidelines.map((guideline, idx) => (
//                               <div key={idx} className="flex items-start space-x-2">
//                                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
//                                 <span>{guideline}</span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         {/* Validations */}
//                         <div className="mb-4">
//                           <h6 className="text-sm font-semibold mb-2 flex items-center space-x-2 text-gray-700">
//                             <Shield className="w-4 h-4 text-indigo-500" />
//                             <span>Validations</span>
//                           </h6>
//                           <div className="space-y-2">
//                             {agent.Validations.map((validation, idx) => (
//                               <div key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
//                                 <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
//                                 <span>{validation}</span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         {/* Decision Points */}
//                         <div className="mb-4">
//                           <h6 className="text-sm font-semibold mb-2 flex items-center space-x-2 text-gray-700">
//                             <Target className="w-4 h-4 text-orange-500" />
//                             <span>Decision Points</span>
//                           </h6>
//                           <div className="space-y-2">
//                             {agent.Decision_points.map((decision, idx) => (
//                               <div key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
//                                 <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
//                                 <span>{decision}</span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         {/* HIL Escalation Triggers */}
//                         <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                           <h6 className="text-sm font-semibold mb-2 flex items-center space-x-2 text-red-700">
//                             <AlertTriangle className="w-4 h-4 text-red-500" />
//                             <span>HIL Escalation Triggers</span>
//                           </h6>
//                           <div className="space-y-2">
//                             {agent.HIL_escalation_triggers.map((trigger, idx) => (
//                               <div key={idx} className="text-sm text-red-700 flex items-start space-x-2">
//                                 <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
//                                 <span>{trigger}</span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
                    
//                     {/* Arrow between agents */}
//                     {index < workflowData.Agents.length - 1 && (
//                       <div className="flex justify-center my-4">
//                         <div className="flex flex-col items-center">
//                           <ArrowDown className="w-6 h-6 text-blue-500" />
//                           <span className="text-sm text-gray-500 mt-1">Next Agent</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//       </>
//       )}
//     </div>
//   );
// }


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Workflow, 
  Play, 
  Pause, 
  CheckCircle,
  ArrowDown,
  ArrowRight,
  Settings,
  Target,
  Shield,
  Brain,
  Database,
  FileCheck,
  AlertTriangle,
  Bot,
  GitBranch,
  List,
  Upload,
  Download,
  Sparkles,
  ClipboardList,
  Users,
  BarChart3,
  CheckSquare,
  Cloud
} from 'lucide-react';
import { useState, useEffect } from 'react';

const API_BASE = '/api';

interface WorkflowAgent {
  Agent_name: string;
  Role_description: string;
  Skillset: string[];
  Domain_knowledge: string[];
  Guidelines: string[];
  Validations: string[];
  Decision_points: string[];
  Sequence_position: number;
  HIL_escalation_triggers: string[];
}

interface WorkflowStep {
  Step_name: string;
  Description: string;
  Annotator_actions?: string[];
  Agent_involvement?: string;
  Expected_output: string;
  Quality_gates?: string[];
}

interface WorkflowData {
  Workflow_Overview: {
    Workflow_name: string;
    Total_agents: number;
    Total_guidelines_covered: number;
    Workflow_description: string;
    Execution_sequence: string[];
    Validation_framework: string;
  };
  Workflow_Process: WorkflowStep[];
  Agents: WorkflowAgent[];
  Workflow_Summary: {
    Workflow_name?: string;
    End_to_end_process?: string;
    Final_deliverables?: string[];
    Objective: string;
    Key_phases: string[];
    Final_outputs?: string[];
    Quality_assurance?: string;
    Quality_assurance_approach?: string;
  };
  Guideline_coverage_verification?: {
    Input_guidelines_count: number;
    Output_guidelines_count: number;
    Coverage_status: string;
  };
}

type Props = {
  sessionId?: string | null;
  onWorkflowGenerated?: () => void;
};

export function WorkflowManagement({ sessionId, onWorkflowGenerated }: Props) {
  const [workflowTab, setWorkflowTab] = useState('process');
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workflowData, setWorkflowData] = useState<WorkflowData | null>(null);

  // Load workflow data when sessionId changes
  useEffect(() => {
    if (sessionId) {
      loadWorkflow();
    }
  }, [sessionId]);

  const loadWorkflow = async () => {
    if (!sessionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/workflow/${sessionId}`);
      if (!res.ok) throw new Error('Failed to load workflow');
      
      const data = await res.json();
      if (data.workflow) {
        setWorkflowData(data.workflow);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWorkflow = async () => {
    if (!sessionId) {
      setError('Please complete extraction first');
      return;
    }
    
    setGenerating(true);
    setError(null);
    
    try {
      const res = await fetch(`${API_BASE}/workflow/${sessionId}/generate`, {
        method: 'POST'
      });
      
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to generate workflow');
      }
      
      const data = await res.json();
      setWorkflowData(data.workflow);
      onWorkflowGenerated?.();
      
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };


  const handleDownloadWorkflow = () => {
    if (!workflowData) return;
    const dataStr = JSON.stringify(workflowData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workflow-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleApproveWorkflow = () => {
    setIsApproved(true);
    setTimeout(() => {
      alert('Workflow approved successfully!');
    }, 100);
  };

  const getAgentIcon = (agentName: string) => {
    switch (agentName) {
      case 'Bounding Box Agent': return <Target className="w-5 h-5 text-blue-500" />;
      case 'Labeling Accuracy Agent': return <Shield className="w-5 h-5 text-green-500" />;
      case 'Spoof Label Agent': return <FileCheck className="w-5 h-5 text-purple-500" />;
      case 'Playback and Annotation Agent': return <Database className="w-5 h-5 text-orange-500" />;
      case 'Tagging Standards Agent': return <Brain className="w-5 h-5 text-indigo-500" />;
      default: return <Bot className="w-5 h-5 text-gray-500" />;
    }
  };

  const getWorkflowStepIcon = (stepName: string) => {
    if (stepName.includes('Data Input')) return <Cloud className="w-6 h-6 text-blue-500" />;
    if (stepName.includes('Guideline Extraction')) return <Sparkles className="w-6 h-6 text-purple-500" />;
    if (stepName.includes('Rubric Generation')) return <ClipboardList className="w-6 h-6 text-green-500" />;
    if (stepName.includes('Annotation')) return <Users className="w-6 h-6 text-orange-500" />;
    if (stepName.includes('Quality Assessment')) return <BarChart3 className="w-6 h-6 text-pink-500" />;
    if (stepName.includes('Compliance')) return <CheckSquare className="w-6 h-6 text-indigo-500" />;
    if (stepName.includes('Output')) return <Download className="w-6 h-6 text-teal-500" />;
    return <CheckCircle className="w-6 h-6 text-gray-500" />;
  };

  const getWorkflowStepColor = (index: number) => {
    const colors = [
      'border-l-blue-500 bg-blue-50',
      'border-l-purple-500 bg-purple-50',
      'border-l-green-500 bg-green-50',
      'border-l-orange-500 bg-orange-50',
      'border-l-pink-500 bg-pink-50',
      'border-l-indigo-500 bg-indigo-50',
      'border-l-teal-500 bg-teal-50'
    ];
    return colors[index] || 'border-l-gray-500 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      {/* Generate Workflow Button and Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Button 
              onClick={handleGenerateWorkflow} 
              disabled={!sessionId || generating || loading}
            >
              {generating ? 'Generating Workflow...' : 'Generate Workflow from Guidelines'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={loadWorkflow}
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
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading workflow...</div>
      ) : !workflowData ? (
        <div className="text-center py-8 text-gray-600">
          No workflow yet. Click "Generate Workflow from Guidelines" to create it automatically.
        </div>
      ) : (
        <>
          {/* Workflow Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Workflow className="w-5 h-5" />
                <span>{workflowData.Workflow_Overview.Workflow_name}</span>
              </CardTitle>
              <CardDescription>
                {workflowData.Workflow_Overview.Workflow_description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Bot className="w-4 h-4 text-blue-500" />
                    <h4>Total Agents</h4>
                  </div>
                  <p className="font-bold">{workflowData.Workflow_Overview.Total_agents}</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileCheck className="w-4 h-4 text-green-500" />
                    <h4>Guidelines Covered</h4>
                  </div>
                  <p className="font-bold">{workflowData.Workflow_Overview.Total_guidelines_covered}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Workflow Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Workflow className="w-5 h-5" />
                <span>Workflow Summary</span>
              </CardTitle>
              <CardDescription>
                {workflowData.Workflow_Summary.Objective}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Visual Flow Representation */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <Cloud className="w-8 h-8 text-blue-500" />
                  <div>
                <p className="text-gray-700">Input Source</p>
                <p className="text-gray-900">Azure Blob / AWS S3</p>
              </div>
            </div>
            
            <ArrowRight className="w-6 h-6 text-gray-400" />
            
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-gray-700">AI Processing</p>
                <p className="text-gray-900">Guideline + Rubric</p>
              </div>
            </div>
            
            <ArrowRight className="w-6 h-6 text-gray-400" />
            
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-gray-700">Annotation</p>
                <p className="text-gray-900">Human + AI Agents</p>
              </div>
            </div>
            
            <ArrowRight className="w-6 h-6 text-gray-400" />
            
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-pink-500" />
              <div>
                <p className="text-gray-700">Quality Check</p>
                <p className="text-gray-900">Assessment + Validation</p>
              </div>
            </div>
            
            <ArrowRight className="w-6 h-6 text-gray-400" />
            
            <div className="flex items-center space-x-3">
              <Download className="w-8 h-8 text-teal-500" />
              <div>
                <p className="text-gray-700">Output Delivery</p>
                <p className="text-gray-900">Cloud Storage</p>
              </div>
            </div>
          </div>

          {/* Key Phases and Outputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="mb-3 flex items-center space-x-2">
                <GitBranch className="w-4 h-4 text-blue-500" />
                <span>Key Phases</span>
              </h5>
              <div className="space-y-2">
                {workflowData.Workflow_Summary.Key_phases.map((phase, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-start space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-gray-700">{phase}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {(workflowData.Workflow_Summary.Final_outputs || workflowData.Workflow_Summary.Final_deliverables) && (
              <div>
                <h5 className="mb-3 flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-green-500" />
                  <span>Final Deliverables</span>
                </h5>
                <div className="space-y-2">
                  {(workflowData.Workflow_Summary.Final_outputs || workflowData.Workflow_Summary.Final_deliverables || []).map((output, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{output}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Header Section with Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Play className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Video Annotation Workflow
                </h3>
                <p className="text-gray-600">
                  End-to-end annotation workflow for video content based on guideline requirements
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={handleDownloadWorkflow}
              >
                <Download className="w-4 h-4" />
                <span>Download Workflow</span>
              </Button>
              <Button 
                variant="outline"
                className={`flex items-center space-x-2 ${isApproved ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'}`}
                onClick={handleApproveWorkflow}
                disabled={isApproved}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Workflow Process and Agents */}
      <Tabs value={workflowTab} onValueChange={setWorkflowTab} className="w-full">
        <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
          <TabsTrigger value="process" className="flex items-center space-x-2 px-6">
            <List className="w-4 h-4" />
            <span>Workflow Process</span>
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center space-x-2 px-6">
            <Bot className="w-4 h-4" />
            <span>Agents</span>
          </TabsTrigger>
        </TabsList>

        {/* Workflow Process Tab */}
        <TabsContent value="process" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <List className="w-5 h-5" />
                <span>Workflow Process</span>
              </CardTitle>
              <CardDescription>
                Sequential steps in the annotation workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(workflowData.Workflow_Process || []).map((step, index) => {
                  const colors = [
                    { bg: 'bg-blue-600', text: 'text-blue-600' },
                    { bg: 'bg-green-600', text: 'text-green-600' },
                    { bg: 'bg-purple-600', text: 'text-purple-600' },
                    { bg: 'bg-orange-600', text: 'text-orange-600' },
                    { bg: 'bg-pink-600', text: 'text-pink-600' },
                    { bg: 'bg-indigo-600', text: 'text-indigo-600' },
                    { bg: 'bg-teal-600', text: 'text-teal-600' }
                  ];
                  const color = colors[index % colors.length];
                  
                  return (
                    <div key={index}>
                      <Card className="border-2">
                        <CardContent className="pt-4">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${color.bg} text-white font-semibold`}>
                                {index + 1}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-3">{step.Step_name}</h4>
                              <p className="text-gray-700 mb-3">{step.Description}</p>
                              
                              {/* Annotator Actions */}
                              {step.Annotator_actions && step.Annotator_actions.length > 0 && (
                                <div className="mb-3">
                                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Annotator Actions:</h5>
                                  <div className="space-y-2">
                                    {step.Annotator_actions.map((action, idx) => (
                                      <div key={idx} className="flex items-start space-x-2">
                                        <CheckCircle className={`w-4 h-4 ${color.text} mt-0.5 flex-shrink-0`} />
                                        <p className="text-gray-700 text-sm">{action}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Agent Involvement */}
                              {step.Agent_involvement && (
                                <div className="mb-3 bg-blue-50 border-2 border-blue-300 border-l-4 border-l-blue-500 rounded-lg p-3">
                                  <p className="text-sm">
                                    <span className="font-medium text-blue-900">Agent Involvement:</span>{' '}
                                    <span className="text-blue-800">{step.Agent_involvement}</span>
                                  </p>
                                </div>
                              )}
                              
                              {/* Expected Output */}
                              <div className="mb-3 bg-green-50 border-2 border-green-300 border-l-4 border-l-green-500 rounded-lg p-3">
                                <p className="text-sm">
                                  <span className="font-medium text-green-900">Expected Output:</span>{' '}
                                  <span className="text-green-800">{step.Expected_output}</span>
                                </p>
                              </div>
                              
                              {/* Quality Gates */}
                              {step.Quality_gates && step.Quality_gates.length > 0 && (
                                <div className="bg-purple-50 border-2 border-purple-300 border-l-4 border-l-purple-500 rounded-lg p-3">
                                  <h5 className="text-sm font-semibold text-purple-900 mb-2">Quality Gates:</h5>
                                  <div className="space-y-1">
                                    {step.Quality_gates.map((gate, idx) => (
                                      <div key={idx} className="flex items-start space-x-2">
                                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                                        <p className="text-sm text-purple-800">{gate}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Arrow between steps */}
                      {index < (workflowData.Workflow_Process || []).length - 1 && (
                        <div className="flex justify-center my-3">
                          <ArrowDown className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Workflow Completion Badge */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900 mb-1">Workflow Process Complete</h4>
                        <p className="text-green-700">
                          All workflow steps defined with quality gates and validation checkpoints
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-600">
                      {(workflowData.Workflow_Process || []).length} Steps
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>Agents</span>
              </CardTitle>
              <CardDescription>
                Multi-agent execution sequence through the workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(workflowData.Agents || []).map((agent, index) => (
                  <div key={agent.Agent_name}>
                    {/* Agent Card */}
                    <Card className="border-2 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-semibold">
                              {agent.Sequence_position}
                            </div>
                            {getAgentIcon(agent.Agent_name)}
                            <div>
                              <CardTitle className="text-base">
                                {agent.Agent_name}
                              </CardTitle>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {(agent.Guidelines || []).length} guidelines
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600 mb-4">
                          {agent.Role_description}
                        </p>
                        
                        {/* Core Capabilities */}
                        <div className="mb-4">
                          <h6 className="text-sm font-semibold mb-2 flex items-center space-x-2 text-gray-700">
                            <Brain className="w-4 h-4 text-blue-500" />
                            <span>Core Capabilities</span>
                          </h6>
                          <div className="space-y-2">
                            {(agent.Skillset || []).map((skill, idx) => (
                              <div key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{skill}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Domain Knowledge */}
                        <div className="mb-4">
                          <h6 className="text-sm font-semibold mb-2 flex items-center space-x-2 text-gray-700">
                            <Database className="w-4 h-4 text-purple-500" />
                            <span>Domain Knowledge</span>
                          </h6>
                          <div className="space-y-2">
                            {(agent.Domain_knowledge || []).map((knowledge, idx) => (
                              <div key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
                                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{knowledge}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Guidelines */}
                        <div className="mb-4">
                          <h6 className="text-sm font-semibold mb-2 flex items-center space-x-2 text-gray-700">
                            <FileCheck className="w-4 h-4 text-green-500" />
                            <span>Guidelines ({(agent.Guidelines || []).length})</span>
                          </h6>
                          <div className="text-sm text-gray-600 space-y-2">
                            {(agent.Guidelines || []).map((guideline, idx) => (
                              <div key={idx} className="flex items-start space-x-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{guideline}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Validations */}
                        <div className="mb-4">
                          <h6 className="text-sm font-semibold mb-2 flex items-center space-x-2 text-gray-700">
                            <Shield className="w-4 h-4 text-indigo-500" />
                            <span>Validations</span>
                          </h6>
                          <div className="space-y-2">
                            {(agent.Validations || []).map((validation, idx) => (
                              <div key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{validation}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Decision Points */}
                        <div className="mb-4">
                          <h6 className="text-sm font-semibold mb-2 flex items-center space-x-2 text-gray-700">
                            <Target className="w-4 h-4 text-orange-500" />
                            <span>Decision Points</span>
                          </h6>
                          <div className="space-y-2">
                            {(agent.Decision_points || []).map((decision, idx) => (
                              <div key={idx} className="text-sm text-gray-600 flex items-start space-x-2">
                                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{decision}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* HIL Escalation Triggers */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <h6 className="text-sm font-semibold mb-2 flex items-center space-x-2 text-red-700">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span>HIL Escalation Triggers</span>
                          </h6>
                          <div className="space-y-2">
                            {(agent.HIL_escalation_triggers || []).map((trigger, idx) => (
                              <div key={idx} className="text-sm text-red-700 flex items-start space-x-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{trigger}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Arrow between agents */}
                    {index < (workflowData.Agents || []).length - 1 && (
                      <div className="flex justify-center my-4">
                        <div className="flex flex-col items-center">
                          <ArrowDown className="w-6 h-6 text-blue-500" />
                          <span className="text-sm text-gray-500 mt-1">Next Agent</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </>
      )}
    </div>
  );
}