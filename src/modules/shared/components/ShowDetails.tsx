"use client";

import { Gender } from "@prisma/client";
import { format } from "date-fns";
import * as React from "react";
import { formatCapital } from "@/modules/shared/utils/helper";

type StudentDetails = {
  title: string;
  contactNo?: string;
  address?: string;
  dob?: string;
  gender?: Gender;
  guardianContactNo?: string;
  guardianFirstName?: string;
  guardianLastName?: string;
  email?: string;
  courseDay?: string;
  createdAt?: string;
};

export default function ShowDetails({
  title,
  contactNo,
  email,
  address,
  dob,
  gender,
  guardianContactNo,
  guardianFirstName,
  guardianLastName,
  courseDay,
  createdAt,
}: StudentDetails) {
  return (
    <div className="max-w-md">
      <h4 className="mb-3 text-lg font-semibold">{title}</h4>
      <div className="grid gap-2 text-sm">
        {courseDay && <Row label="Course Day">{formatCapital(courseDay)}</Row>}
        {createdAt && (
          <Row label="Created At">
            {format(new Date(createdAt), "dd MMM yyyy hh:mm a")}
          </Row>
        )}

        {contactNo && <Row label="Contact">{contactNo}</Row>}
        {email && <Row label="Email">{email}</Row>}
        {address && <Row label="Address">{address}</Row>}
        {dob && <Row label="Date of Birth">{format(new Date(dob), "PPP")}</Row>}
        {gender && <Row label="Gender">{formatCapital(gender)}</Row>}
        {guardianContactNo && (
          <Row label="Guardian Contact">{guardianContactNo}</Row>
        )}
        {guardianFirstName && guardianLastName && (
          <Row label="Guardian Name">
            {`${guardianFirstName} ${guardianLastName}`}
          </Row>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: React.PropsWithChildren<{ label: string }>) {
  return (
    <div className="flex items-start gap-2">
      <span className="w-36 shrink-0 text-slate-500">{label}</span>
      <span className="font-medium text-slate-800 break-words">{children}</span>
    </div>
  );
}
