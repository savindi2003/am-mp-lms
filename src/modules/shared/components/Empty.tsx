function Empty({ resourceName }: { resourceName: string }) {
  return (
    <p className="mt-5 bg-slate-100 p-6 text-center text-xs text-slate-600 shadow sm:text-base mx-10 font-medium">
      No {resourceName} could be found!
    </p>
  );
}

export default Empty;
