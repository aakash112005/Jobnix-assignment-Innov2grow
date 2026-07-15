import { motion } from 'framer-motion';

const stages = ['Applied', 'Reviewed', 'Interview', 'Offer'];

/**
 * The signature visual motif of the product: a hiring pipeline rendered as
 * a track with a traveling card, echoing what actually happens to every
 * application on the platform. Used large in the hero, and small-scale
 * inside the candidate dashboard to show real application progress.
 */
const PipelineTrack = ({ activeIndex = 2, compact = false }) => {
  return (
    <div className={compact ? 'w-full' : 'mx-auto w-full max-w-md'}>
      <div className="relative">
        <div className="h-1.5 w-full rounded-full bg-black/5 dark:bg-white/10" />
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${(activeIndex / (stages.length - 1)) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute left-0 top-0 h-1.5 rounded-full bg-pipeline-gradient"
        />
        <div className="absolute inset-0 flex items-center justify-between">
          {stages.map((stage, i) => (
            <div key={stage} className="relative flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: 'spring', stiffness: 300, damping: 15 }}
                className={`h-4 w-4 rounded-full border-2 border-white dark:border-ink ${
                  i <= activeIndex ? 'bg-primary-500' : 'bg-black/20 dark:bg-white/20'
                }`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex justify-between">
        {stages.map((stage, i) => (
          <span
            key={stage}
            className={`font-mono text-[11px] uppercase tracking-wide ${
              i <= activeIndex ? 'text-primary-600 dark:text-primary-300' : 'text-ink/40 dark:text-paper/40'
            }`}
          >
            {stage}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PipelineTrack;
