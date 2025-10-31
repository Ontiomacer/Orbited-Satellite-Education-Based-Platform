import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import ReadyWorkflowExecutor from '../components/ReadyWorkflowExecutor';

const WorkflowExecutor = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
          >
            <ReadyWorkflowExecutor />
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default WorkflowExecutor;