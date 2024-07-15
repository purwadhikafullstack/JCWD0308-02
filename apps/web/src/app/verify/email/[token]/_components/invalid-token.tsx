export function InvalidToken({ errorMessage }: { errorMessage: string }) {
  return (
    <div className="container relative h-[inherit] flex flex-col items-center justify-center ">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {errorMessage}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
