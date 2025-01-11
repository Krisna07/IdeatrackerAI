import { motion } from "framer-motion";

const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function ThreeDotsWave() {
  return (
    <motion.div
      className="  rounded-full flex items-center gap-2 justify-between"
      variants={loadingContainerVariants}
      initial="start"
      animate="end"
    >
      <motion.span
        className="w-2 h-2 bg-black rounded-full"
        animate={{ y: ["-4px", "4px", "-4px"] }}
        transition={{ repeat: Infinity, duration: 0.5, delay: 0.3 }}
      />
      <motion.span
        className="w-2 h-2 bg-black rounded-full"
        animate={{ y: ["-4px", "4px", "-4px"] }}
        transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }}
      />
      <motion.span
        className="w-2 h-2 bg-black rounded-full"
        animate={{ y: ["-4px", "4px", "-4px"] }}
        transition={{ repeat: Infinity, duration: 0.5, delay: 0.3 }}
      />
    </motion.div>
  );
}
