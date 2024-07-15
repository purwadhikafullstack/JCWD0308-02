export function TokenExpired() {
  return (
    <div className="container relative h-[inherit] flex flex-col items-center justify-center ">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[320px]">
          <div className="flex flex-col space-y-2 text-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Your link is expired!
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
