import Image from "next/image";

function AboutUs() {
  return (
    <section className="py-24 relative">
      <h3 className="text-4xl my-10 mx-10 font-semibold text-slate-800">
        About Us
      </h3>
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full justify-start items-center gap-12 grid lg:grid-cols-2 grid-cols-1">
          {/* Left side images */}
          <div className="w-full justify-center items-start gap-6 grid sm:grid-cols-2 grid-cols-1 lg:order-first order-last">
            <div className="pt-24 lg:justify-center sm:justify-end justify-start items-start gap-2.5 flex">
              <Image
                className="object-cover h-80 w-70 rounded-xs"
                src="/about/photo-1.jpg"
                alt="About us image 1"
                width={280}
                height={320}
              />
            </div>
            <Image
              className="sm:ml-0 ml-auto h-80 w-70 object-cover rounded-xs"
              src="/about/photo-2.jpg"
              alt="About us image 2"
              width={280}
              height={320}
            />
          </div>

          {/* Right side content */}
          <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
            <div className="w-full flex-col justify-center items-start gap-8 flex">
              <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                <h2 className="text-slate-900 text-4xl font-bold font-manrope leading-normal lg:text-start text-center">
                  Empowering Each Other to Succeed
                </h2>
                <p className="text-slate-500 text-base font-normal leading-relaxed lg:text-start text-center">
                  Every project we&apos;ve undertaken has been a collaborative
                  effort, where every person involved has left their mark.
                  Together, we&apos;ve not only constructed buildings but also
                  built enduring connections that define our success story.
                </p>
              </div>

              <div className="w-full lg:justify-start justify-center items-center sm:gap-10 gap-5 inline-flex">
                <div className="flex-col justify-start items-start inline-flex">
                  <h3 className="text-slate-800 text-4xl font-bold font-manrope leading-normal">
                    3+
                  </h3>
                  <h6 className="text-slate-500 text-base font-normal leading-relaxed">
                    Years of Experience
                  </h6>
                </div>
                <div className="flex-col justify-start items-start inline-flex">
                  <h4 className="text-slate-800 text-4xl font-bold font-manrope leading-normal">
                    25+
                  </h4>
                  <h6 className="text-slate-500 text-base font-normal leading-relaxed">
                    Successful Projects
                  </h6>
                </div>
                <div className="flex-col justify-start items-start inline-flex">
                  <h4 className="text-slate-800 text-4xl font-bold font-manrope leading-normal">
                    20+
                  </h4>
                  <h6 className="text-slate-500 text-base font-normal leading-relaxed">
                    Happy Clients
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
