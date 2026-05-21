import Image from "next/image";
import CourseCardBox from "@/modules/home/components/CourseCardBox";
import HomeNavBar from "@/modules/home/components/HomeNavBar";
import { getCourses } from "@/modules/courses/data/action";
import AboutUs from "@/modules/home/components/AboutUs";
import FreeLectureList from "@/modules/home/components/FreeLectureList";
import FreeLectureSlider from "@/modules/home/components/FreeLectureSlider";
import HeroSection from "@/modules/home/components/HeroSection";
import PastFreeClassSlider from "@/modules/home/components/PastFreeClassSlider";

export default async function HomePage() {
  const courses = await getCourses();

  const courseCardData = courses?.map((course) => ({
    id: course.id,
    description: course.description,
    photo: course.photo,
    courseType: course.courseType.name,
    instructor: {
      firstName: course.instructor.firstName,
      lastName: course.instructor.lastName,
      title: course.instructor.title,
      user: {
        photo: course.instructor.user.photo,
      },
    },
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <HomeNavBar />

      <HeroSection />

      {/* Blurb */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-700 mb-4">
              Your Pathway to A Grade Success in Science
            </h2>
            <p className="text-slate-700 text-sm sm:text-base mb-4">
              Join engaging live classes designed to make science simple and enjoyable.
              Master every concept with theory lessons, focused revision, and in-depth paper discussions all in one place.
              <br /><br />
              Never miss a lesson with unlimited access to recorded sessions 📚
              <br /><br />
              Strengthen your understanding with past papers and MCQ practice, and steadily build your knowledge to reach excellence in Science 🚀
            </p>
            {/*<Button className="cursor-pointer text-base sm:text-lg">*/}
            {/*  See More*/}
            {/*</Button>*/}
          </div>
          <div className="flex justify-center">
            <Image
              src="/primary/teaching-photo.png"
              alt="Instructor teaching"
              width={520}
              height={360}
              priority
              className="w-full max-w-sm md:max-w-md h-auto rounded-xs object-cover"
              sizes="(min-width:1024px) 520px, (min-width:640px) 420px, 100vw"
            />
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="bg-slate-50 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">


          <FreeLectureSlider />

        </div>
      </section>

      <section id="courses" className="bg-slate-50 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">

          <PastFreeClassSlider />

        </div>
      </section>



      {/* Contact (simple in-page section to scroll to) */}
      <section id="contact" className="bg-white py-16 sm:py-20 scroll-mt-24">
        <div className="mx-auto max-w-4xl lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-10">
            Ready to start your learning journey?
          </h2>
          <p className="text-slate-800 max-w-2xl mx-auto mb-8 bg-yellow-400 w-fit p-2 sm:rounded rounded font-medium flex flex-col sm:flex-row sm:gap-1">
            Reach us at{" "}
            <a href="mailto:hello@example.com" className="underline">
              milan.pitagaldeniya@gmail.com
            </a>{" "}
            <span>or call +94 11 123 4567</span>
          </p>
        </div>
      </section>


    </div>
  );
}
