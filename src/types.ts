/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  badge?: string;
  imageUrl: string;
  gallery: string[];
  priceEstimate: number;
  dimensions: string;
  rooms: string;
  deliveryTime: string;
  specs: string[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  projectInterest?: string;
  status: 'novo' | 'contatado' | 'arquivado';
  createdAt: string;
  targetBudget?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  imageUrl: string;
  readTime: string;
  date: string;
}

export interface AppSettings {
  resendApiKey: string;
  notifiedEmail: string;
  senderEmail: string;
}
