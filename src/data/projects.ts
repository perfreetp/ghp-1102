import { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'P001',
    name: '滨江花园住宅小区项目',
    location: '上海市浦东新区滨江大道188号',
    manager: '张建国',
    managerPhone: '13812345678',
    startDate: '2025-03-15',
    endDate: '2026-12-30',
    status: 'active',
    projectType: '住宅建筑',
    area: '12.5万㎡',
    buildingCount: 8,
    stats: {
      totalArrivals: 328,
      pendingSampling: 12,
      pendingInspection: 8,
      rectifications: 5,
      passRate: 96.8
    }
  },
  {
    id: 'P002',
    name: '创新科技园A栋办公楼',
    location: '上海市张江高科技园区博云路2号',
    manager: '李伟强',
    managerPhone: '13987654321',
    startDate: '2025-01-10',
    endDate: '2026-06-30',
    status: 'active',
    projectType: '商业办公',
    area: '8.2万㎡',
    buildingCount: 3,
    stats: {
      totalArrivals: 456,
      pendingSampling: 6,
      pendingInspection: 3,
      rectifications: 2,
      passRate: 98.2
    }
  },
  {
    id: 'P003',
    name: '中心医院扩建工程',
    location: '上海市徐汇区宜山路600号',
    manager: '王德华',
    managerPhone: '13701234567',
    startDate: '2024-09-01',
    endDate: '2026-09-01',
    status: 'active',
    projectType: '医疗建筑',
    area: '6.8万㎡',
    buildingCount: 5,
    stats: {
      totalArrivals: 512,
      pendingSampling: 15,
      pendingInspection: 10,
      rectifications: 8,
      passRate: 94.5
    }
  },
  {
    id: 'P004',
    name: '城际高铁枢纽站',
    location: '上海市闵行区申长路1500号',
    manager: '陈志远',
    managerPhone: '13611223344',
    startDate: '2024-06-20',
    endDate: '2027-03-31',
    status: 'paused',
    projectType: '交通枢纽',
    area: '25.0万㎡',
    buildingCount: 12,
    stats: {
      totalArrivals: 678,
      pendingSampling: 0,
      pendingInspection: 0,
      rectifications: 12,
      passRate: 97.1
    }
  },
  {
    id: 'P005',
    name: '文化艺术中心项目',
    location: '上海市嘉定区嘉定镇街道100号',
    manager: '赵明辉',
    managerPhone: '13599887766',
    startDate: '2023-12-01',
    endDate: '2025-11-30',
    status: 'completed',
    projectType: '文化建筑',
    area: '4.5万㎡',
    buildingCount: 2,
    stats: {
      totalArrivals: 286,
      pendingSampling: 0,
      pendingInspection: 0,
      rectifications: 3,
      passRate: 99.1
    }
  }
];

export const currentProjectId = 'P001';

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(p => p.id === id);
};

export const getActiveProjects = (): Project[] => {
  return projects.filter(p => p.status === 'active');
};
