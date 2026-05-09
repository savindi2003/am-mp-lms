import { Instructor } from "@/modules/shared/types/typeInstructor";

export interface Class {
    id : number;
    classType:{
        name:string;
        id:number;
    };
    classFee:number;
    description:string;
    instructorId:number;
    createdAt:string;
    instructor?:Instructor;
    

}

export interface ClassWithStudent extends Class {
  Student: Record<string, number | string>;
}
