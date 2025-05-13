import { Phone, Video } from "lucide-react";
import Link from "next/link";

const CreateOptions = () => {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <Link
        href={"/dashboard/create-interview"}
        className="dark:bg-[rgb(16,23,39)] rounded-lg  border border-gray-300 p-4 flex flex-col gap-2 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Video className="p-3 bg-white text-blue-600 rounded-lg h-12 w-12" />
          <h2 className="font-bold text-lg">Create New Interview</h2>
        </div>
        <p className="text-muted-foreground">
          Create AI interview and schedule the interview
        </p>
      </Link>
      <div className="dark:bg-[rgb(16,23,39)] rounded-lg  border border-gray-300 p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Phone className="p-3 bg-white text-blue-600 rounded-lg h-12 w-12" />
          <h2 className="font-bold text-lg">Create Phone Screening Call</h2>
        </div>
        <p className="text-muted-foreground">
          Schedule a phone screening call with the candidate
        </p>
      </div>
    </div>
  );
};

export default CreateOptions;
