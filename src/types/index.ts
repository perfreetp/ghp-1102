// 项目信息
export interface Project {
  id: string;
  name: string;
  location: string;
  manager: string;
  managerPhone: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'completed';
  stats: {
    totalArrivals: number;
    pendingSampling: number;
    pendingInspection: number;
    rectifications: number;
    passRate: number;
  };
  buildingCount: number;
  area: string;
  projectType: string;
}

// 到货验收
export interface Arrival {
  id: string;
  projectId: string;
  projectName: string;
  batchNo: string;
  materialName: string;
  materialType: string;
  spec: string;
  contractSpec: string;
  quantity: number;
  unit: string;
  supplier: string;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  arrivalTime: string;
  receiver: string;
  witness: string;
  photos: string[];
  nameplatePhoto: string;
  appearancePhotos: string[];
  specMatched: boolean;
  status: 'pending' | 'accepted' | 'rejected' | 'sampling' | 'completed';
  remarks: string;
  samplingIds: string[];
  inspectionIds: string[];
  installIds: string[];
}

// 取样送检
export interface Sampling {
  id: string;
  arrivalId: string;
  projectId: string;
  batchNo: string;
  materialName: string;
  spec: string;
  samplingNo: string;
  samplingTime: string;
  sampler: string;
  witness: string;
  witnessUnit: string;
  witnessPhone: string;
  samplingQuantity: string;
  samplingLocation: string;
  representQuantity: number;
  lab: string;
  sendTime: string;
  sender: string;
  receiveTime: string;
  expectedResultTime: string;
  status: 'pending' | 'sent' | 'testing' | 'done';
  inspectionId?: string;
  remarks: string;
}

// 检测结果
export interface Inspection {
  id: string;
  samplingId: string;
  arrivalId: string;
  projectId: string;
  batchNo: string;
  materialName: string;
  spec: string;
  reportNo: string;
  labName: string;
  inspector: string;
  inspectDate: string;
  conclusion: 'qualified' | 'unqualified' | 'partial';
  items: {
    name: string;
    standard: string;
    result: string;
    isQualified: boolean;
  }[];
  reInspection: boolean;
  parentInspectionId?: string;
  blockUsage: boolean;
  rectificationRequired: boolean;
  rectificationId?: string;
  remarks: string;
  reportPhotos: string[];
}

// 安装位置记录
export interface InstallRecord {
  id: string;
  arrivalId: string;
  projectId: string;
  batchNo: string;
  materialName: string;
  spec: string;
  building: string;
  floor: string;
  unit: string;
  location: string;
  component: string;
  constructionTeam: string;
  teamLeader: string;
  teamLeaderPhone: string;
  installDate: string;
  quantity: number;
  operator: string;
  supervisor: string;
  installPhotos: string[];
  status: 'installed' | 'inspected' | 'accepted';
  remarks: string;
}

// 整改记录
export interface Rectification {
  id: string;
  projectId: string;
  sourceType: 'inspection' | 'arrival' | 'install';
  sourceId: string;
  sourceNo: string;
  title: string;
  description: string;
  rectPhotos: string[];
  initiator: string;
  initiateTime: string;
  deadline: string;
  handler: string;
  handlerPhone: string;
  handlerTeam: string;
  status: 'pending' | 'processing' | 'reviewing' | 'approved' | 'rejected';
  measures: string;
  resultDescription: string;
  resultPhotos: string[];
  finishTime: string;
  reviewer: string;
  reviewTime: string;
  reviewComment: string;
}

// 追溯节点
export interface TraceNode {
  id: string;
  type: 'arrival' | 'sampling' | 'inspection' | 'install' | 'rectification';
  title: string;
  subtitle: string;
  time: string;
  operator: string;
  status: string;
  statusType: 'success' | 'warning' | 'error' | 'info' | 'pending';
}

// 筛选条件
export interface FilterOption {
  label: string;
  value: string;
}

// 通用列表响应
export interface ListResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 导出配置
export interface ExportConfig {
  type: 'arrival' | 'sampling' | 'inspection' | 'ledger';
  dateRange: [string, string];
  projectId?: string;
  materialType?: string;
  status?: string;
}
