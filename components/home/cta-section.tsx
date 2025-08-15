import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { containerVariants, itemVariants } from "@/utils/constants";
import {
  MotionDiv,
  MotionH2,
  MotionP,
  MotionSection,
} from "../common/motion-wrapper";

const buttonVariants = {
  scale: 1.05,
  transition: {
    type: "spring" as const,
    stiffness: 300,
    damping: 10,
  },
};

export default function CTASection() {
  return (
    <MotionSection
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-50 py-12 "
    >
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <MotionH2
              whileHover={itemVariants}
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            >
              {" "}
              Prêt à économiser des heures de lecture ?{" "}
            </MotionH2>
            <MotionP
              whileHover={itemVariants}
              className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400"
            >
              Transformez de longs documents en informations claires et
              exploitables grâce à notre outil de synthèse basé sur l&apos;IA.
            </MotionP>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
            <MotionDiv
              variants={itemVariants}
              whileHover={buttonVariants}
              className=""
            >
              <Button
                size="lg"
                variant={"link"}
                className="w-full min-[400px]:w-auto bg-linear-to-r from-slate-900 to-rose-500 hover:from-rose-500 hover:to-slate-900 hover:text-white text-white transition-all duration-300 flex items-center justify-center"
              >
                <Link
                  href="/#pricing"
                  className="flex items-center justify-center"
                >
                  Commencer{" "}
                  <ArrowRight className="ml-2 h-4 w-4 animate-pulse" />
                </Link>
              </Button>
            </MotionDiv>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
