import Image from "next/image";

export default function Page() {
  return (
    <section className="relative min-h-[calc(100dvh-96px)] overflow-hidden px-4 py-5 sm:px-6">
      <div className="pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-brand/10 blur-[120px]" />

      <div className="relative">
        <h1 className="text-2xl font-semibold leading-8 text-foreground">Cashback</h1>
        <p className="mt-1 text-sm font-normal text-muted-foreground">Mô tả trang Cashback</p>
      </div>

      <div className="relative flex min-h-[calc(100dvh-220px)] items-center justify-center">
        <div className="flex max-w-[420px] flex-col items-center text-center">
          <Image
            src="/images/icons/comingsoon_icon.svg"
            alt=""
            width={75}
            height={75}
            className="h-[75px] w-[75px]"
            priority
          />
          <h2 className="mt-5 text-[32px] font-medium leading-10 text-foreground">Coming Soon</h2>
          <p className="mt-4 text-sm font-normal leading-5 text-muted-foreground">
            Trang này hiện đang trong quá trình phát triển
            <br />
            Bạn có thể khám phá những nội dung khác của SCEX
          </p>
        </div>
      </div>
    </section>
  );
  // return <CashbackPageScreen />;
}
