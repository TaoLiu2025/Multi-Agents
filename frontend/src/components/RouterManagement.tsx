import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  GitBranch, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Bot,
  Target,
  Shield,
  FileCheck,
  Database,
  Brain,
  Zap,
  Eye,
  Search,
  Settings,
  Play,
  ArrowRight,
  Clock,
  CheckCheck,
  Users,
  Library
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

interface WorkflowAgent {
  Agent_name: string;
  Role_description: string;
  Skillset: string[];
  Domain_knowledge: string[];
  Guidelines: string[];
}

interface LibraryAgent {
  id: string;
  name: string;
  version: string;
  capabilities: string[];
  performance_metrics: {
    accuracy: number;
    speed: number;
    reliability: number;
  };
  max_workload: number;
  status: 'available' | 'busy' | 'maintenance';
  last_deployed: string;
  description?: string;
}

interface MatchingFactors {
  name_similarity: number;
  capability_overlap: number;
  skillset_alignment: number;
  performance_threshold: number;
  availability_status: number;
}

interface MatchedAgent {
  workflow_agent: WorkflowAgent;
  library_agent: LibraryAgent | null;
  match_score: number;
  match_status: 'matched' | 'partial' | 'unmatched';
  approval_status: 'pending' | 'approved' | 'rejected';
  assigned_guidelines: number;
  matching_factors: MatchingFactors;
}

export function RouterManagement() {
  // Workflow agents from the Workflow Management component
  const workflowAgents: WorkflowAgent[] = [
    {
      Agent_name: "Bounding Box Agent",
      Role_description: "Responsible for creating, maintaining, and calibrating bounding boxes for annotation purposes to ensure consistent quality and compliance.",
      Skillset: [
        "Proficiency in annotation tools for bounding box creation",
        "Advanced knowledge of bounding box calibration techniques",
        "Expertise in estimating object boundaries in complex scenarios",
        "Data validation and annotation consistency"
      ],
      Domain_knowledge: [
        "Image and video annotation techniques",
        "Computer vision fundamentals",
        "Boundary estimation in occlusion conditions"
      ],
      Guidelines: ["1", "4", "14", "15", "24", "25", "35", "47", "62", "63"]
    },
    {
      Agent_name: "Labeling Accuracy Agent",
      Role_description: "Ensures accurate labeling of faces, heads, and upper bodies under varying visibility conditions.",
      Skillset: [
        "Proficiency in visibility threshold analysis",
        "Domain knowledge of facial recognition features",
        "Annotation tag accuracy validation under partial visibility",
        "Advanced motion tracking in videos"
      ],
      Domain_knowledge: [
        "Best practices in facial and human labeling",
        "Partial visibility thresholds for annotation",
        "Handling overlap and ambiguity in label ownership"
      ],
      Guidelines: ["3", "12", "13", "17", "20", "21", "33", "34", "40", "42", "43", "65", "66", "67", "71"]
    },
    {
      Agent_name: "Spoof Label Agent",
      Role_description: "Handles Spoof label application, reflection categorization, and identification of human-like objects to ensure accurate annotation.",
      Skillset: [
        "Spoof label tagging proficiency",
        "Expertise in reflection detection and classification",
        "Knowledge of human-like representation categorization",
        "Validation of real human identification"
      ],
      Domain_knowledge: [
        "Best practices in Spoof handling",
        "Human vs. non-human representation diagnostics",
        "Reflections and likeness labeling intricacies"
      ],
      Guidelines: ["5", "6", "7", "8", "9", "22", "23", "27", "28", "29", "36", "38", "39", "41", "44", "69", "73", "75", "76", "77"]
    },
    {
      Agent_name: "Playback and Annotation Agent",
      Role_description: "Ensures video playback, annotation tools usability, and consistent maintenance of workflow annotations.",
      Skillset: [
        "Expertise in video playback and annotation tools",
        "Knowledge of annotation workflow optimization techniques",
        "Proficiency in reviewing video scenes and detection behaviors",
        "Consistency checks across annotation edits"
      ],
      Domain_knowledge: [
        "Best practices in video annotation workflows",
        "Annotation tool usage and management",
        "Quality assessment for annotation consistency"
      ],
      Guidelines: ["16", "18", "19", "45", "46", "48", "49", "51", "53", "54", "55", "56", "57", "58", "59", "60", "61", "64", "72"]
    },
    {
      Agent_name: "Tagging Standards Agent",
      Role_description: "Focuses on systematic criteria and standardized tagging for accurate annotation.",
      Skillset: [
        "Proficiency in systematic tagging schema",
        "Advanced data layout and lighting analysis in video scenes",
        "Ability to validate Pose (Yaw and Pitch) tagging",
        "Knowledge in handling motion and video quality issues"
      ],
      Domain_knowledge: [
        "Facial feature and Pose labeling techniques",
        "Annotation layouts and systematic methodologies",
        "Motion-related annotation accuracy in low video quality scenarios"
      ],
      Guidelines: ["2", "10", "11", "26", "30", "31", "32", "37", "50", "52", "68", "70", "74", "78"]
    }
  ];

  // Library of available agents
  const libraryAgents: LibraryAgent[] = [
    {
      id: "lib-001",
      name: "Bounding Box Agent",
      version: "v2.3.1",
      description: "Specialized agent for creating, maintaining, and calibrating bounding boxes with advanced occlusion handling.",
      capabilities: ["bounding box creation", "calibration", "occlusion handling", "annotation consistency"],
      performance_metrics: {
        accuracy: 96,
        speed: 88,
        reliability: 94
      },
      max_workload: 15,
      status: 'available',
      last_deployed: "2024-10-20"
    },
    {
      id: "lib-002",
      name: "Labeling Accuracy Agent",
      version: "v1.9.5",
      description: "Expert in visibility analysis and facial recognition with advanced motion tracking capabilities.",
      capabilities: ["visibility analysis", "facial recognition", "motion tracking", "label validation"],
      performance_metrics: {
        accuracy: 94,
        speed: 92,
        reliability: 96
      },
      max_workload: 20,
      status: 'available',
      last_deployed: "2024-10-21"
    },
    {
      id: "lib-003",
      name: "Spoof Label Agent",
      version: "v3.1.0",
      description: "Advanced spoof detection with reflection classification and human-like object identification.",
      capabilities: ["spoof detection", "reflection classification", "human-like object identification", "real human validation"],
      performance_metrics: {
        accuracy: 98,
        speed: 85,
        reliability: 97
      },
      max_workload: 25,
      status: 'available',
      last_deployed: "2024-10-19"
    },
    {
      id: "lib-004",
      name: "Playback and Annotation Agent",
      version: "v2.7.2",
      description: "Manages video playback and annotation workflows with scene analysis and consistency validation.",
      capabilities: ["video playback", "annotation workflow", "scene analysis", "consistency validation"],
      performance_metrics: {
        accuracy: 91,
        speed: 93,
        reliability: 95
      },
      max_workload: 22,
      status: 'available',
      last_deployed: "2024-10-22"
    },
    {
      id: "lib-005",
      name: "Tagging Standards Agent",
      version: "v1.5.8",
      description: "Ensures systematic tagging with pose validation and lighting/motion quality assessment.",
      capabilities: ["systematic tagging", "pose validation", "lighting analysis", "motion quality assessment"],
      performance_metrics: {
        accuracy: 93,
        speed: 90,
        reliability: 92
      },
      max_workload: 18,
      status: 'available',
      last_deployed: "2024-10-23"
    },
    {
      id: "lib-006",
      name: "Quality Control Agent",
      version: "v2.1.3",
      description: "Comprehensive quality assessment with compliance checking and automated error detection.",
      capabilities: ["quality assessment", "compliance checking", "error detection", "report generation"],
      performance_metrics: {
        accuracy: 97,
        speed: 87,
        reliability: 98
      },
      max_workload: 12,
      status: 'available',
      last_deployed: "2024-10-18"
    },
    {
      id: "lib-007",
      name: "Data Validation Agent",
      version: "v3.0.1",
      description: "Validates data integrity with schema validation and advanced anomaly detection.",
      capabilities: ["data integrity", "schema validation", "anomaly detection", "consistency checking"],
      performance_metrics: {
        accuracy: 95,
        speed: 91,
        reliability: 93
      },
      max_workload: 16,
      status: 'available',
      last_deployed: "2024-10-17"
    },
    {
      id: "lib-008",
      name: "Performance Monitor Agent",
      version: "v1.8.4",
      description: "Tracks performance metrics with threshold monitoring and real-time alert generation.",
      capabilities: ["performance tracking", "metric collection", "threshold monitoring", "alert generation"],
      performance_metrics: {
        accuracy: 92,
        speed: 95,
        reliability: 94
      },
      max_workload: 10,
      status: 'busy',
      last_deployed: "2024-10-16"
    },
    {
      id: "lib-009",
      name: "Compliance Audit Agent",
      version: "v2.4.0",
      description: "Audits processes for regulatory compliance with automated documentation and reporting.",
      capabilities: ["regulatory compliance", "audit trails", "policy enforcement", "documentation"],
      performance_metrics: {
        accuracy: 99,
        speed: 82,
        reliability: 99
      },
      max_workload: 8,
      status: 'available',
      last_deployed: "2024-10-15"
    },
    {
      id: "lib-010",
      name: "Error Recovery Agent",
      version: "v1.3.2",
      description: "Handles error recovery with automated rollback and state restoration capabilities.",
      capabilities: ["error handling", "rollback operations", "state recovery", "failure diagnosis"],
      performance_metrics: {
        accuracy: 89,
        speed: 94,
        reliability: 91
      },
      max_workload: 14,
      status: 'available',
      last_deployed: "2024-10-14"
    }
  ];

  // Matching algorithm function
  const calculateMatch = (wfAgent: WorkflowAgent, libAgent: LibraryAgent): { score: number; factors: MatchingFactors } => {
    // Factor 1: Name Similarity (30% weight)
    const nameSimilarity = wfAgent.Agent_name.toLowerCase() === libAgent.name.toLowerCase() ? 100 : 0;
    
    // Factor 2: Capability Overlap (25% weight)
    const wfSkillsLower = wfAgent.Skillset.map(s => s.toLowerCase());
    const libCapsLower = libAgent.capabilities.map(c => c.toLowerCase());
    const overlapCount = libCapsLower.filter(cap => 
      wfSkillsLower.some(skill => skill.includes(cap) || cap.includes(skill.split(' ').slice(-2).join(' ')))
    ).length;
    const capabilityOverlap = libCapsLower.length > 0 ? (overlapCount / libCapsLower.length) * 100 : 0;
    
    // Factor 3: Skillset Alignment (20% weight)
    const roleKeywords = wfAgent.Role_description.toLowerCase().split(' ');
    const alignedCapabilities = libCapsLower.filter(cap => 
      roleKeywords.some(keyword => cap.includes(keyword))
    ).length;
    const skillsetAlignment = libCapsLower.length > 0 ? (alignedCapabilities / libCapsLower.length) * 100 : 0;
    
    // Factor 4: Performance Threshold (15% weight)
    const avgPerformance = (
      libAgent.performance_metrics.accuracy + 
      libAgent.performance_metrics.speed + 
      libAgent.performance_metrics.reliability
    ) / 3;
    const performanceThreshold = avgPerformance >= 90 ? 100 : avgPerformance >= 85 ? 80 : 60;
    
    // Factor 5: Availability Status (10% weight)
    const availabilityStatus = libAgent.status === 'available' ? 100 : libAgent.status === 'busy' ? 50 : 0;
    
    // Calculate weighted total score
    const totalScore = 
      (nameSimilarity * 0.30) +
      (capabilityOverlap * 0.25) +
      (skillsetAlignment * 0.20) +
      (performanceThreshold * 0.15) +
      (availabilityStatus * 0.10);
    
    return {
      score: Math.round(totalScore),
      factors: {
        name_similarity: Math.round(nameSimilarity),
        capability_overlap: Math.round(capabilityOverlap),
        skillset_alignment: Math.round(skillsetAlignment),
        performance_threshold: Math.round(performanceThreshold),
        availability_status: Math.round(availabilityStatus)
      }
    };
  };

  // Initial matching logic
  const initialMatches: MatchedAgent[] = workflowAgents.map((wfAgent) => {
    let bestMatch: LibraryAgent | null = null;
    let bestScore = 0;
    let bestFactors: MatchingFactors = {
      name_similarity: 0,
      capability_overlap: 0,
      skillset_alignment: 0,
      performance_threshold: 0,
      availability_status: 0
    };
    
    // Try to find the best matching library agent
    for (const libAgent of libraryAgents) {
      const { score, factors } = calculateMatch(wfAgent, libAgent);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = libAgent;
        bestFactors = factors;
      }
    }
    
    let matchStatus: 'matched' | 'partial' | 'unmatched' = 'unmatched';
    if (bestScore >= 80) {
      matchStatus = 'matched';
    } else if (bestScore >= 50) {
      matchStatus = 'partial';
    }
    
    return {
      workflow_agent: wfAgent,
      library_agent: bestMatch,
      match_score: bestScore,
      match_status: matchStatus,
      approval_status: 'pending' as const,
      assigned_guidelines: wfAgent.Guidelines.length,
      matching_factors: bestFactors
    };
  });

  const [matches, setMatches] = useState<MatchedAgent[]>(initialMatches);
  const [activeRouterTab, setActiveRouterTab] = useState('matching');
  const [selectedMatch, setSelectedMatch] = useState<MatchedAgent | null>(null);
  const [selectedLibraryAgent, setSelectedLibraryAgent] = useState<LibraryAgent | null>(null);

  const handleApprove = (agentName: string) => {
    setMatches(prev => prev.map(m => 
      m.workflow_agent.Agent_name === agentName 
        ? { ...m, approval_status: 'approved' as const }
        : m
    ));
  };

  const handleReject = (agentName: string) => {
    setMatches(prev => prev.map(m => 
      m.workflow_agent.Agent_name === agentName 
        ? { ...m, approval_status: 'rejected' as const }
        : m
    ));
  };

  const approvedCount = matches.filter(m => m.approval_status === 'approved').length;
  const rejectedCount = matches.filter(m => m.approval_status === 'rejected').length;
  const pendingCount = matches.filter(m => m.approval_status === 'pending').length;
  const matchedCount = matches.filter(m => m.match_status === 'matched').length;

  // Get matched agent IDs to filter unmatched library agents
  const matchedAgentIds = matches
    .filter(m => m.library_agent !== null)
    .map(m => m.library_agent!.id);
  
  const unmatchedLibraryAgents = libraryAgents.filter(
    la => !matchedAgentIds.includes(la.id)
  );

  const getMatchStatusIcon = (status: string) => {
    switch (status) {
      case 'matched': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partial': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'unmatched': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
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

  return (
    <div className="space-y-6">
      {/* Router Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GitBranch className="w-5 h-5" />
            <span>Agent Router - Orchestration Layer</span>
          </CardTitle>
          <CardDescription>
            The heart of the framework: matches workflow agents with library agents, enables human approval, and distributes work
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Search className="w-4 h-4 text-blue-500" />
                <h4>Workflow Agents</h4>
              </div>
              <p className="font-bold">{workflowAgents.length}</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Database className="w-4 h-4 text-purple-500" />
                <h4>Library Agents</h4>
              </div>
              <p className="font-bold">{libraryAgents.length}</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <h4>Matched</h4>
              </div>
              <p className="font-bold text-green-600">{matchedCount}</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCheck className="w-4 h-4 text-blue-500" />
                <h4>Approved</h4>
              </div>
              <p className="font-bold text-blue-600">{approvedCount}</p>
            </div>
          </div>

          {/* Matching Algorithm Info */}
          <Card className="mb-4 bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Matching Algorithm</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-3">
                Agents are matched using a weighted scoring system based on 5 key factors:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="p-3 bg-white rounded border">
                  <div className="flex items-center justify-between mb-1">
                    <span>Name Similarity</span>
                    <Badge variant="secondary">30%</Badge>
                  </div>
                  <p className="text-gray-600">Exact name matching between workflow and library agents</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <div className="flex items-center justify-between mb-1">
                    <span>Capability Overlap</span>
                    <Badge variant="secondary">25%</Badge>
                  </div>
                  <p className="text-gray-600">Overlap between required skills and agent capabilities</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <div className="flex items-center justify-between mb-1">
                    <span>Skillset Alignment</span>
                    <Badge variant="secondary">20%</Badge>
                  </div>
                  <p className="text-gray-600">Alignment of role description with capabilities</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <div className="flex items-center justify-between mb-1">
                    <span>Performance</span>
                    <Badge variant="secondary">15%</Badge>
                  </div>
                  <p className="text-gray-600">Agent performance metrics threshold (90%+ ideal)</p>
                </div>
                <div className="p-3 bg-white rounded border">
                  <div className="flex items-center justify-between mb-1">
                    <span>Availability</span>
                    <Badge variant="secondary">10%</Badge>
                  </div>
                  <p className="text-gray-600">Current availability status of the agent</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t text-gray-600">
                <p><span>Match Thresholds:</span> Matched (≥80%), Partial (50-79%), Unmatched (&lt;50%)</p>
              </div>
            </CardContent>
          </Card>

          {/* View Library Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="mb-4">
                <Library className="w-4 h-4 mr-2" />
                View Complete Agent Library ({libraryAgents.length} agents)
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[85vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Library className="w-5 h-5" />
                  <span>Complete Agent Library</span>
                </DialogTitle>
                <DialogDescription>
                  Browse all {libraryAgents.length} available agents with their capabilities and performance metrics
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {libraryAgents.map((agent) => {
                    const isMatched = matchedAgentIds.includes(agent.id);
                    return (
                      <Card 
                        key={agent.id} 
                        className={`border-2 ${isMatched ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getAgentIcon(agent.name)}
                              <div>
                                <CardTitle className="flex items-center space-x-2">
                                  <span>{agent.name}</span>
                                  {isMatched && (
                                    <Badge variant="default" className="bg-green-600">
                                      Matched
                                    </Badge>
                                  )}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                  {agent.description}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <Badge variant="outline">{agent.version}</Badge>
                              <Badge 
                                variant={agent.status === 'available' ? 'default' : 'secondary'}
                                className={agent.status === 'available' ? 'bg-green-600' : ''}
                              >
                                {agent.status}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div>
                              <h6 className="mb-2">Capabilities</h6>
                              <div className="flex flex-wrap gap-2">
                                {agent.capabilities.map((cap, idx) => (
                                  <Badge key={idx} variant="secondary">
                                    {cap}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span>Accuracy</span>
                                  <span>{agent.performance_metrics.accuracy}%</span>
                                </div>
                                <Progress value={agent.performance_metrics.accuracy} className="h-2" />
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span>Speed</span>
                                  <span>{agent.performance_metrics.speed}%</span>
                                </div>
                                <Progress value={agent.performance_metrics.speed} className="h-2" />
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span>Reliability</span>
                                  <span>{agent.performance_metrics.reliability}%</span>
                                </div>
                                <Progress value={agent.performance_metrics.reliability} className="h-2" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-gray-600 pt-2 border-t">
                              <div className="flex items-center space-x-1">
                                <span>ID: {agent.id}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span>Max Workload: {agent.max_workload}</span>
                                <span>•</span>
                                <span>Last Deployed: {agent.last_deployed}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Router Tabs */}
      <Tabs value={activeRouterTab} onValueChange={setActiveRouterTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="matching" className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Agent Matching</span>
          </TabsTrigger>
          <TabsTrigger value="approval" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>HIL Approval</span>
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4" />
            <span>Work Distribution</span>
          </TabsTrigger>
        </TabsList>

        {/* Matching Tab */}
        <TabsContent value="matching">
          <Card>
            <CardHeader>
              <CardTitle>Agent Matching Results</CardTitle>
              <CardDescription>
                Workflow agents matched against the agent library based on capabilities and roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {matches.map((match) => (
                  <Card key={match.workflow_agent.Agent_name} className="border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getAgentIcon(match.workflow_agent.Agent_name)}
                          <div>
                            <CardTitle>{match.workflow_agent.Agent_name}</CardTitle>
                            <CardDescription className="mt-1">
                              {match.workflow_agent.Role_description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getMatchStatusIcon(match.match_status)}
                          <Badge variant={match.match_status === 'matched' ? 'default' : 'secondary'}>
                            {match.match_score}% Match
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* Matching Factors Breakdown */}
                      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h6 className="mb-3 flex items-center space-x-2">
                          <Target className="w-4 h-4 text-blue-600" />
                          <span>Matching Factors Breakdown</span>
                        </h6>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span>Name</span>
                              <span>{match.matching_factors.name_similarity}%</span>
                            </div>
                            <Progress value={match.matching_factors.name_similarity} className="h-2" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span>Capabilities</span>
                              <span>{match.matching_factors.capability_overlap}%</span>
                            </div>
                            <Progress value={match.matching_factors.capability_overlap} className="h-2" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span>Skillset</span>
                              <span>{match.matching_factors.skillset_alignment}%</span>
                            </div>
                            <Progress value={match.matching_factors.skillset_alignment} className="h-2" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span>Performance</span>
                              <span>{match.matching_factors.performance_threshold}%</span>
                            </div>
                            <Progress value={match.matching_factors.performance_threshold} className="h-2" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span>Availability</span>
                              <span>{match.matching_factors.availability_status}%</span>
                            </div>
                            <Progress value={match.matching_factors.availability_status} className="h-2" />
                          </div>
                        </div>
                        <div className="mt-2 text-gray-600">
                          <span>Overall Match Score: </span>
                          {match.match_score}% (
                          {match.match_status === 'matched' && 'Strong Match'}
                          {match.match_status === 'partial' && 'Partial Match'}
                          {match.match_status === 'unmatched' && 'Weak Match'}
                          )
                        </div>
                      </div>

                      {match.library_agent && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h6 className="mb-2">Library Agent</h6>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">
                                  {match.library_agent.version}
                                </Badge>
                                <Badge variant="outline">
                                  ID: {match.library_agent.id}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Clock className="w-3 h-3" />
                                <span>Last deployed: {match.library_agent.last_deployed}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded ${
                                  match.library_agent.status === 'available' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {match.library_agent.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h6 className="mb-2">Performance Metrics</h6>
                            <div className="space-y-2">
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span>Accuracy</span>
                                  <span>{match.library_agent.performance_metrics.accuracy}%</span>
                                </div>
                                <Progress value={match.library_agent.performance_metrics.accuracy} />
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span>Speed</span>
                                  <span>{match.library_agent.performance_metrics.speed}%</span>
                                </div>
                                <Progress value={match.library_agent.performance_metrics.speed} />
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span>Reliability</span>
                                  <span>{match.library_agent.performance_metrics.reliability}%</span>
                                </div>
                                <Progress value={match.library_agent.performance_metrics.reliability} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-gray-600">
                          <span>{match.assigned_guidelines}</span> guidelines assigned
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedMatch(match)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                {getAgentIcon(match.workflow_agent.Agent_name)}
                                <span>{match.workflow_agent.Agent_name}</span>
                              </DialogTitle>
                              <DialogDescription>
                                Complete agent details and matching information
                              </DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="h-[500px] pr-4">
                              <div className="space-y-4">
                                {/* Matching Score Card */}
                                <Card className="bg-blue-50 border-blue-200">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center justify-between">
                                      <span className="flex items-center space-x-2">
                                        <Target className="w-4 h-4" />
                                        <span>Match Score: {match.match_score}%</span>
                                      </span>
                                      <Badge variant={match.match_status === 'matched' ? 'default' : 'secondary'}>
                                        {match.match_status === 'matched' && 'Strong Match'}
                                        {match.match_status === 'partial' && 'Partial Match'}
                                        {match.match_status === 'unmatched' && 'Weak Match'}
                                      </Badge>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="pt-0">
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <div className="flex items-center justify-between mb-1">
                                          <span>Name Similarity (30%)</span>
                                          <span>{match.matching_factors.name_similarity}%</span>
                                        </div>
                                        <Progress value={match.matching_factors.name_similarity} className="h-2" />
                                      </div>
                                      <div>
                                        <div className="flex items-center justify-between mb-1">
                                          <span>Capability Overlap (25%)</span>
                                          <span>{match.matching_factors.capability_overlap}%</span>
                                        </div>
                                        <Progress value={match.matching_factors.capability_overlap} className="h-2" />
                                      </div>
                                      <div>
                                        <div className="flex items-center justify-between mb-1">
                                          <span>Skillset Alignment (20%)</span>
                                          <span>{match.matching_factors.skillset_alignment}%</span>
                                        </div>
                                        <Progress value={match.matching_factors.skillset_alignment} className="h-2" />
                                      </div>
                                      <div>
                                        <div className="flex items-center justify-between mb-1">
                                          <span>Performance (15%)</span>
                                          <span>{match.matching_factors.performance_threshold}%</span>
                                        </div>
                                        <Progress value={match.matching_factors.performance_threshold} className="h-2" />
                                      </div>
                                      <div className="col-span-2">
                                        <div className="flex items-center justify-between mb-1">
                                          <span>Availability (10%)</span>
                                          <span>{match.matching_factors.availability_status}%</span>
                                        </div>
                                        <Progress value={match.matching_factors.availability_status} className="h-2" />
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                <Separator />
                                <div>
                                  <h6 className="mb-2">Role Description</h6>
                                  <p className="text-gray-600">{match.workflow_agent.Role_description}</p>
                                </div>
                                <Separator />
                                <div>
                                  <h6 className="mb-2">Skillset</h6>
                                  <div className="space-y-1">
                                    {match.workflow_agent.Skillset.map((skill, idx) => (
                                      <div key={idx} className="text-gray-600 flex items-start space-x-2">
                                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>{skill}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <Separator />
                                <div>
                                  <h6 className="mb-2">Domain Knowledge</h6>
                                  <div className="space-y-1">
                                    {match.workflow_agent.Domain_knowledge.map((knowledge, idx) => (
                                      <div key={idx} className="text-gray-600 flex items-start space-x-2">
                                        <Brain className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                        <span>{knowledge}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                {match.library_agent && (
                                  <>
                                    <Separator />
                                    <div>
                                      <h6 className="mb-2">Library Agent Capabilities</h6>
                                      <div className="space-y-1">
                                        {match.library_agent.capabilities.map((cap, idx) => (
                                          <Badge key={idx} variant="secondary" className="mr-2 mb-2">
                                            {cap}
                                          </Badge>
                                        ))}
                                      </div>
                                      <div className="mt-3 text-gray-600">
                                        <p>Max Workload: <span>{match.library_agent.max_workload}</span> guidelines</p>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approval Tab */}
        <TabsContent value="approval">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Human-in-the-Loop Approval</span>
              </CardTitle>
              <CardDescription>
                Review and approve matched agents before work distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="font-bold text-green-600">{approvedCount}</p>
                      <p className="text-gray-600">Approved</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-yellow-600">{pendingCount}</p>
                      <p className="text-gray-600">Pending</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-red-600">{rejectedCount}</p>
                      <p className="text-gray-600">Rejected</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Progress value={(approvedCount / matches.length) * 100} className="w-48 mb-2" />
                    <p className="text-gray-600">
                      {approvedCount} of {matches.length} agents approved
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {matches.map((match) => (
                  <Card 
                    key={match.workflow_agent.Agent_name} 
                    className={`border-2 ${
                      match.approval_status === 'approved' ? 'border-green-500 bg-green-50' :
                      match.approval_status === 'rejected' ? 'border-red-500 bg-red-50' :
                      'border-gray-200'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getAgentIcon(match.workflow_agent.Agent_name)}
                          <div>
                            <CardTitle className="flex items-center space-x-2">
                              <span>{match.workflow_agent.Agent_name}</span>
                              {match.approval_status === 'approved' && (
                                <Badge variant="default" className="bg-green-600">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Approved
                                </Badge>
                              )}
                              {match.approval_status === 'rejected' && (
                                <Badge variant="destructive">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Rejected
                                </Badge>
                              )}
                              {match.approval_status === 'pending' && (
                                <Badge variant="secondary">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Pending Review
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Matched with {match.library_agent?.name} ({match.library_agent?.version})
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{match.assigned_guidelines} guidelines</Badge>
                          <Badge variant={match.match_status === 'matched' ? 'default' : 'secondary'}>
                            {match.match_score}% Match
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-gray-600">
                          {match.library_agent && (
                            <>
                              <div className="flex items-center space-x-1">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                <span>Accuracy: {match.library_agent.performance_metrics.accuracy}%</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Target className="w-4 h-4 text-blue-500" />
                                <span>Speed: {match.library_agent.performance_metrics.speed}%</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Shield className="w-4 h-4 text-green-500" />
                                <span>Reliability: {match.library_agent.performance_metrics.reliability}%</span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {match.approval_status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleReject(match.workflow_agent.Agent_name)}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleApprove(match.workflow_agent.Agent_name)}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                            </>
                          )}
                          {(match.approval_status === 'approved' || match.approval_status === 'rejected') && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setMatches(prev => prev.map(m => 
                                m.workflow_agent.Agent_name === match.workflow_agent.Agent_name 
                                  ? { ...m, approval_status: 'pending' as const }
                                  : m
                              ))}
                            >
                              Reset
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GitBranch className="w-5 h-5" />
                <span>Work Distribution</span>
              </CardTitle>
              <CardDescription>
                {approvedCount > 0 
                  ? `${approvedCount} approved agents actively processing assigned guidelines`
                  : 'Approve agents in the HIL Approval tab to begin work distribution'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {approvedCount > 0 ? (
                <>
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="text-green-900">{approvedCount} agents approved and operational</p>
                        <p className="text-green-700">
                          Processing {matches.filter(m => m.approval_status === 'approved').reduce((sum, m) => sum + m.assigned_guidelines, 0)} total guidelines
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {matches
                      .filter(m => m.approval_status === 'approved')
                      .map((match, index) => (
                        <Card key={match.workflow_agent.Agent_name} className="border-2 border-blue-200">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                                  {index + 1}
                                </div>
                                {getAgentIcon(match.workflow_agent.Agent_name)}
                                <div>
                                  <CardTitle>{match.workflow_agent.Agent_name}</CardTitle>
                                  <CardDescription className="mt-1">
                                    Processing {match.assigned_guidelines} guidelines
                                  </CardDescription>
                                </div>
                              </div>
                              <Badge variant="default" className="bg-green-600">
                                <Play className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span>Processing Progress</span>
                                  <span>{65 + index * 5}%</span>
                                </div>
                                <Progress value={65 + index * 5} />
                              </div>
                              <div className="grid grid-cols-3 gap-3">
                                <div className="p-2 bg-gray-50 rounded">
                                  <p className="text-gray-600">Assigned</p>
                                  <p className="font-bold">{match.assigned_guidelines}</p>
                                </div>
                                <div className="p-2 bg-green-50 rounded">
                                  <p className="text-gray-600">Completed</p>
                                  <p className="font-bold text-green-600">
                                    {Math.floor(match.assigned_guidelines * (0.65 + index * 0.05))}
                                  </p>
                                </div>
                                <div className="p-2 bg-blue-50 rounded">
                                  <p className="text-gray-600">In Progress</p>
                                  <p className="font-bold text-blue-600">
                                    {match.assigned_guidelines - Math.floor(match.assigned_guidelines * (0.65 + index * 0.05))}
                                  </p>
                                </div>
                              </div>
                              {match.library_agent && (
                                <div className="flex items-center justify-between text-gray-600 pt-2 border-t">
                                  <span>Workload: {match.assigned_guidelines} / {match.library_agent.max_workload}</span>
                                  <span>ETA: {3 - index} minutes</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>

                  <div className="mt-6 flex space-x-2">
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure Distribution
                    </Button>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Monitor Performance
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-gray-900 mb-2">No Approved Agents</h3>
                  <p className="text-gray-600 mb-4">
                    Please approve agents in the HIL Approval tab to see work distribution
                  </p>
                  <Button onClick={() => setActiveRouterTab('approval')}>
                    <Users className="w-4 h-4 mr-2" />
                    Go to HIL Approval
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
