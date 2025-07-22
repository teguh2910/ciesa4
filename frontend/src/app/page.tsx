'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Edit, 
  Upload, 
  Settings, 
  FileText, 
  Shield, 
  Eye, 
  Download, 
  RefreshCw,
  ArrowRight,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useHealthCheck, useConfig } from '@/hooks/useApi';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Edit,
    title: 'Manual Input',
    description: 'Enter data manually through user-friendly forms with validation and help text.',
    href: '/manual-input',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
  },
  {
    icon: Upload,
    title: 'Excel Upload',
    description: 'Upload Excel files with your data. Download our template to get started quickly.',
    href: '/excel-upload',
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
  },
  {
    icon: Settings,
    title: 'API Configuration',
    description: 'Configure your API endpoint, authentication, and test the connection.',
    href: '/api-config',
    color: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600',
  },
];

const highlights = [
  {
    icon: Shield,
    title: 'Data Validation',
    description: 'Comprehensive validation ensures your data meets Indonesian customs API requirements.',
  },
  {
    icon: Eye,
    title: 'JSON Preview',
    description: 'Preview the generated JSON structure before sending to ensure accuracy.',
  },
  {
    icon: Download,
    title: 'Excel Templates',
    description: 'Download pre-formatted Excel templates with sample data and proper structure.',
  },
  {
    icon: RefreshCw,
    title: 'Multiple Auth Methods',
    description: 'Support for API keys, basic authentication, and custom headers.',
  },
];

const steps = [
  {
    number: 1,
    title: 'Configure API',
    description: 'Set up your API endpoint and authentication credentials.',
  },
  {
    number: 2,
    title: 'Input Data',
    description: 'Choose manual input or upload Excel file with your customs data.',
  },
  {
    number: 3,
    title: 'Send to API',
    description: 'Preview the JSON and send it to your Indonesian customs API endpoint.',
  },
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { data: healthData, execute: checkHealth } = useHealthCheck();
  const { data: configData, execute: loadConfig } = useConfig();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      checkHealth();
      loadConfig();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                <span className="text-gradient">JSON Response Generator</span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Generate and send JSON responses for Indonesian customs/import API endpoints. 
                Choose your preferred method to input data and configure your API settings.
              </p>
              
              {/* Status indicators */}
              {mounted && (
                <div className="flex items-center justify-center space-x-6 mb-8">
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      healthData?.data?.status === 'healthy' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                    )}></div>
                    <span className="text-sm text-gray-600">
                      API {healthData?.data?.status === 'healthy' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Ready to Use</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Method
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select how you'd like to input your customs data and generate JSON responses.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <Link href={feature.href as any}>
                    <div className="group relative bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 p-8 h-full">
                      <div className={cn(
                        "inline-flex items-center justify-center w-12 h-12 rounded-lg text-white mb-6 transition-colors",
                        feature.color,
                        feature.hoverColor
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4">
                        {feature.description}
                      </p>
                      
                      <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
                        <span>Get Started</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make Indonesian customs API integration simple and reliable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-600">
                    {highlight.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-xl shadow-soft p-8 lg:p-12"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quick Start Guide
              </h2>
              <p className="text-lg text-gray-600">
                Get started with JSON Response Generator in three simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  className="text-center relative"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-full font-bold text-lg mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                  
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gray-200 transform -translate-x-6"></div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/api-config">
                <button className="btn-primary btn-lg">
                  <Settings className="w-5 h-5 mr-2" />
                  Start Configuration
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
