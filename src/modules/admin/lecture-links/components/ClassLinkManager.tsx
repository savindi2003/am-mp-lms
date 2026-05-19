"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/modules/ui/button";
import { useRouter } from "next/navigation";

export default function ClassLinkManager({
    courseId,
    currentExpireDate,
    googleEventId,
    meetingLink,
    classname,
    grade,
}: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [expireDate, setExpireDate] = useState("");

    const expire = useMemo(() => new Date(currentExpireDate), [currentExpireDate]);
    const now = new Date();

    const isExpired = expire < now;

    const remainingDays = useMemo(() => {
        const diff = expire.getTime() - now.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }, [expire]);

    async function updateMeeting() {
        if (!expireDate) return toast.error("Please select expire date");

        setLoading(true);

        try {
            const res = await fetch(
                `/api/backend/admin/courses/${courseId}/meeting`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ expireDate }),
                }
            );

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Update failed");

            toast.success("Meeting updated successfully");
            router.refresh();
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    }

    function copyLink() {
        if (!meetingLink) return;
        navigator.clipboard.writeText(meetingLink);
        toast.success("Meeting link copied");
    }

    return (
        <div className=" bg-slate-200 p-5 space-y-5">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src="/meet.png"
                        alt="Google Meet"
                        className="w-10 h-10"
                    />

                    <div>
                        <h2 className="text-2xl font-semibold text-slate-800">
                            {grade} - {classname}
                        </h2>
                        <p className="text-xs text-slate-500">
                            Manage Google Meet link & expiry
                        </p>
                    </div>
                </div>

                <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${isExpired
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                >
                    {isExpired ? "Expired" : "Active"}
                </span>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50">
                    <p className="text-xs text-slate-500">Expire Date</p>
                    <p className="font-medium text-slate-700">
                        {expire.toDateString()}
                    </p>
                </div>

                <div className="p-3 bg-slate-50">
                    <p className="text-xs text-slate-500">Remaining Days</p>
                    <p
                        className={`font-semibold ${isExpired ? "text-red-500" : "text-slate-800"
                            }`}
                    >
                        {isExpired ? "0" : remainingDays} days
                    </p>
                </div>
            </div>

            {/* MEETING LINK */}
            <div className="flex items-center justify-between bg-white border p-3">
                <div className="truncate">
                    <p className="text-xs text-slate-500">Meeting Link</p>
                    <p className="text-sm font-medium text-slate-700 truncate mt-2">
                        {meetingLink || "No link available"}
                    </p>
                </div>

                <Button variant="secondary" onClick={copyLink}>
                    Copy
                </Button>
            </div>

            {/* UPDATE SECTION */}
            <div className="space-y-2 bg-white p-4">
                <p className="text-sm font-medium text-slate-700">
                    Update Expiry Date
                </p>

                <input
                    type="date"
                    className="w-full border px-3 py-2 text-sm focus:ring-2 focus:ring-slate-400 outline-none"
                    onChange={(e) => setExpireDate(e.target.value)}
                />

                <div className="flex justify-end pt-2">
                    <Button onClick={updateMeeting} disabled={loading}>
                        {loading ? "Updating..." : "Update Meeting Link"}
                    </Button>
                </div>
            </div>

            {/* WARNING */}
            {isExpired && (
                <div className="text-sm bg-red-50 text-red-600 p-3 rounded-lg">
                    ⚠️ This meeting has expired. Students cannot join unless updated.
                </div>
            )}
        </div>
    );
}