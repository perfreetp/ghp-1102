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
  projectName?: string;
  batchNo: string;
  materialName: string;
  materialType: string;
  spec: string;
  contractSpec: string;
  specMatched: boolean;
  quantity: number;
  unit: string;
  supplier: string;
  vehicleNo?: string;
  driverName?: string;
  driverPhone?: string;
  receiver: string;
  witness: string;
  arrivalTime: string;
  status: 'pending' | 'accepted' | 'sampling' | 'completed' | 'rejected' | 'mismatch';
  photos: {
    nameplate: string[];
    appearance: string[];
  };
  samplingIds: string[];
  inspectionIds: string[];
  installIds: string[];
  remarks?: string;
}

// 取样送检
export interface Sampling {
  id: string;
  arrivalId: string;
  projectId: string;
  batchNo: string;
  samplingNo: string;
  materialName: string;
  materialType: string;
  spec: string;
  quantity: number;
  unit: string;
  samplingDate: string;
  samplingPoints: string[];
  sampler: string;
  witnessName: string;
  witnessUnit: string;
  witnessPhone: string;
  labName: string;
  labAddress: string;
  sealNo: string;
  sendDate: string;
  receiveDate: string;
  reportDate: string;
  reportNo: string;
  currentStep: number;
  status: 'pending' | 'sampling' | 'sent' | 'testing' | 'done';
  remarks?: string;
  photos?: {
    sealed: string[];
    process: string[];
  };
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
  remarks?: string;
  reportPhotos: string[];
}

// 安装使用的材料子项
export interface InstallMaterialItem {
  batchNo: string;
  materialName: string;
  spec: string;
  quantity: number;
  unit: string;
}

// 安装位置记录
export interface InstallRecord {
  id: string;
  arrivalId?: string;
  projectId: string;
  building: string;
  floor: string;
  area: string;
  unit?: string;
  componentName: string;
  componentCode: string;
  teamName: string;
  teamLeader: string;
  teamPhone: string;
  installDate: string;
  quantity: number;
  unit: string;
  materials: InstallMaterialItem[];
  installPhotos: string[];
  status: 'installed' | 'inspected' | 'accepted';
  remarks?: string;
}

// 整改时间线节点
export interface RectTimelineStep {
  action: string;
  operator: string;
  time: string;
  remark?: string;
}

// 整改记录
export interface Rectification {
  id: string;
  rectNo: string;
  projectId: string;
  sourceType: 'inspection' | 'arrival' | 'install' | 'patrol';
  sourceBatchNo?: string;
  source?: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'processing' | 'confirming' | 'approved' | 'rejected';
  responsible: string;
  location: string;
  deadline: string;
  createdBy: string;
  createDate: string;
  timeline: RectTimelineStep[];
  rectPhotos?: string[];
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

export interface FilterOption {
  label: string;
  value: string;
}

export interface ListResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ExportConfig {
  type: 'arrival' | 'sampling' | 'inspection' | 'ledger';
  dateRange: [string, string];
  projectId?: string;
  materialType?: string;
  status?: string;
}
