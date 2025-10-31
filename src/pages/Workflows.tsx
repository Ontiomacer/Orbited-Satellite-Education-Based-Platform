import WorkflowManager from '@/components/WorkflowManager';
import ErrorBoundary from '@/components/ErrorBoundary';

const Workflows = () => {
  return (
    <ErrorBoundary>
      <WorkflowManager />
    </ErrorBoundary>
  );
};

export default Workflows;