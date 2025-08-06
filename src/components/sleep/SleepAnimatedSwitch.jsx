import { AnimatePresence, motion } from "framer-motion";
import SleepStats from "./SleepStats";
import SleepRecord from "./SleepRecord";
import SleepQualityRating from "./SleepQualityRating";

function SleepAnimatedSwitch({ activeTab, setActiveTab, rating, setRating }) {
  return (
    <div className="sleep-animated-switch">
      <AnimatePresence mode="wait">
        {activeTab === "record" && (
          <motion.div
            key="record"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <SleepRecord />
            <SleepQualityRating
              rating={rating}
              setRating={setRating}
              onSaveComplete={() => setActiveTab("stats")}
            />
          </motion.div>
        )}

        {activeTab === "stats" && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SleepStats />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SleepAnimatedSwitch;
