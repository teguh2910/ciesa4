'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  validation?: (data: any) => string[];
}

interface FormWizardProps {
  steps: WizardStep[];
  onComplete: (data: any) => void;
  onStepChange?: (stepIndex: number) => void;
  initialData?: any;
  className?: string;
}

export function FormWizard({
  steps,
  onComplete,
  onStepChange,
  initialData = {},
  className,
}: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<string[]>([]);

  const updateFormData = useCallback((stepData: any) => {
    setFormData((prev: any) => ({ ...prev, ...stepData }));
  }, []);

  const validateCurrentStep = useCallback(() => {
    const currentStepConfig = steps[currentStep];
    if (currentStepConfig.validation) {
      const stepErrors = currentStepConfig.validation(formData);
      setErrors(stepErrors);
      return stepErrors.length === 0;
    }
    setErrors([]);
    return true;
  }, [currentStep, formData, steps]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
      onStepChange?.(stepIndex);
      setErrors([]);
    }
  }, [steps.length, onStepChange]);

  const nextStep = useCallback(() => {
    if (validateCurrentStep()) {
      setCompletedSteps(prev => new Set(Array.from(prev).concat(currentStep)));
      
      if (currentStep === steps.length - 1) {
        onComplete(formData);
      } else {
        goToStep(currentStep + 1);
      }
    }
  }, [currentStep, steps.length, validateCurrentStep, formData, onComplete, goToStep]);

  const prevStep = useCallback(() => {
    goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  const isStepCompleted = useCallback((stepIndex: number) => {
    return completedSteps.has(stepIndex);
  }, [completedSteps]);

  const isStepAccessible = useCallback((stepIndex: number) => {
    if (stepIndex === 0) return true;
    return isStepCompleted(stepIndex - 1) || stepIndex <= currentStep;
  }, [currentStep, isStepCompleted]);

  const CurrentStepComponent = steps[currentStep]?.component;

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
            <div 
              className="h-full bg-primary-600 transition-all duration-500"
              style={{ 
                width: `${(currentStep / (steps.length - 1)) * 100}%` 
              }}
            />
          </div>

          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center relative bg-white px-2"
            >
              <button
                onClick={() => isStepAccessible(index) && goToStep(index)}
                disabled={!isStepAccessible(index)}
                className={cn(
                  'w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-all duration-300',
                  index === currentStep
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : isStepCompleted(index)
                    ? 'border-green-500 bg-green-500 text-white'
                    : isStepAccessible(index)
                    ? 'border-gray-300 bg-white text-gray-700 hover:border-primary-600'
                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                )}
              >
                {isStepCompleted(index) ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </button>
              
              <div className="mt-2 text-center">
                <div className={cn(
                  'text-sm font-medium',
                  index === currentStep
                    ? 'text-primary-600'
                    : isStepCompleted(index)
                    ? 'text-green-600'
                    : 'text-gray-500'
                )}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-400 mt-1 max-w-24 hidden sm:block">
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <h4 className="text-sm font-medium text-red-800 mb-2">
            Please fix the following errors:
          </h4>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-soft border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {steps[currentStep]?.title}
          </h2>
          <p className="text-gray-600 mt-1">
            {steps[currentStep]?.description}
          </p>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {CurrentStepComponent && (
                <CurrentStepComponent
                  data={formData}
                  onChange={updateFormData}
                  errors={errors}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={cn(
              'btn btn-secondary',
              currentStep === 0 && 'opacity-50 cursor-not-allowed'
            )}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <button
            type="button"
            onClick={nextStep}
            className="btn btn-primary"
          >
            {currentStep === steps.length - 1 ? (
              <>
                Complete
                <Check className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
