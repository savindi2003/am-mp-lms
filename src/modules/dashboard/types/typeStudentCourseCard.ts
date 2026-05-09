export type StudentClassCardType = {
  id: number;
  photo?: string | null;
  classFee: number;
  description: string;
  month?: string | null;

  classType: {
    id: number;
    name: string;
  };

  instructor: {
    firstName: string;
    lastName: string;
    title: string;
  };
};