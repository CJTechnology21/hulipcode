import { motion } from "framer-motion";
import truck from "../../images/truck.jpg";

export default function MovingTruck() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white">
      <motion.img
        src={truck}
        alt="Truck"
        className="w-60"
        animate={{ y: [0, -5, 0, 5, 0] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
