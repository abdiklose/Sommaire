import Link from "next/link";
import { Card } from "../ui/card";
import DeleteButton from "./delete-button";
import { FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn, formatFileName } from "@/lib/utils";
import { MotionDiv } from "../common/motion-wrapper";
import { itemVariants } from "@/utils/constants";

interface Summary {
  id: string;
  original_file_url: string;
  title: string | null;
  created_at: string;
  summary_text: string;
  status: string;
}

const SummaryHeader = ({
  fileUrl,
  title,
  createdAt,
}: {
  fileUrl: string;
  title: string | null;
  createdAt: string;
}) => {
  let formattedDate = "Date inconnue";

  if (createdAt) {
    // Si c'est un objet Date, on le garde, sinon on le convertit
    const dateValue =
      typeof createdAt === "string"
        ? new Date(createdAt.replace(" ", "T"))
        : new Date(createdAt);

    if (!isNaN(dateValue.getTime())) {
      formattedDate = formatDistanceToNow(dateValue, { addSuffix: true });
    }
  }

  return (
    <div className="flex items-start gap-3">
      {/* Icône document */}
      <FileText className="w-6 h-6 text-rose-400 mt-1" />
      <div className="flex-1 min-w-0">
        {/* Titre tronqué */}
        <h3 className="text-sm font-semibold text-gray-900 truncate">
          {title || formatFileName(fileUrl)}
        </h3>
        {/* Date relative */}
        <p className="text-xs text-gray-500">{formattedDate}</p>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  return (
    <span
      className={cn(
        "px-2 py-0.5 text-xs font-medium rounded-full capitalize",
        status === "completed"
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800",
      )}
    >
      {status}
    </span>
  );
};

export default function SummaryCard({ summary }: { summary: Summary }) {
  return (
    <MotionDiv
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeInOut" },
      }}
    >
      <Card className="relative h-full overflow-hidden">
        {/* Bouton delete en haut à droite */}
        <div className="absolute top-2 right-2">
          <DeleteButton summaryId={summary.id} />
        </div>

        <Link href={`summaries/${summary.id}`} className="block p-4">
          <div className="flex flex-col gap-3">
            {/* En-tête avec titre + date */}
            <SummaryHeader
              fileUrl={summary.original_file_url}
              title={summary.title}
              createdAt={summary.created_at} // <-- bien created_at
            />

            {/* Résumé tronqué sur 2 lignes */}
            <p className="text-gray-600 line-clamp-2 text-sm">
              {summary.summary_text}
            </p>

            {/* Badge en bas à gauche */}
            <div className="flex mt-1">
              <StatusBadge status={summary.status} />
            </div>
          </div>
        </Link>
      </Card>
    </MotionDiv>
  );
}
