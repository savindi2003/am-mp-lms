import { getClasses } from "@/modules/courses/data/action";
import ClassListClient from "./ClassListClient";

async function ClassCardList({
  role,
  classTypes,
}: {
  role: string | undefined;
  classTypes: any[];
}) {
  const classes = await getClasses();

  return (
    <ClassListClient
      initialClasses={classes}
      role={role}
      classTypes={classTypes}
    />
  );
}

export default ClassCardList;