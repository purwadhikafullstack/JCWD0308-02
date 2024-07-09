import Image from 'next/image';
export function WhyGrosirun() {
  const infoParagraph = [
    {
      title: 'Local Convenience',
      description:
        'At Grosirun, we guide you to the nearest store, ensuring you get your groceries quickly and conveniently. Enjoy a seamless shopping experience tailored to your location.',
      picture: '/Location-review-bro.png',
    },
    {
      title: 'Verified Suppliers',
      description:
        'Trust and safety are our top priorities. We require all suppliers to undergo a stringent verification process to ensure the highest quality of products.',
      picture: '/Verified-bro.png',
    },
    {
      title: 'Exclusive Discounts',
      description:
        'Enjoy premium groceries at unbeatable prices. Take advantage of special offers and seasonal promotions to stretch your shopping budget further',
      picture: '/Discount-pana.png',
    },
    {
      title: '24/7 Customer Support',
      description:
        'Whether you need help with your order or require assistance with our services, Grosirun is always just a call or click away.',
      picture: '/Active-Support-pana.png',
    },
  ];
  return (
    <div className="container my-16 flex flex-col gap-6">
      <div className="text-3xl font-bold">Why Grosirun?</div>
      <div className="grid lg:grid-cols-2 gap-4 ">
        {infoParagraph.map((x, i) => (
          <div
            key={i}
            className="p-5 gap-2 border md:h-[210px] 2xl:h-[300px] rounded-lg grid md:flex items-center"
          >
            <div className="h-full w-full">
              <Image
                src={`${x.picture}`}
                width={50}
                height={50}
                alt="Destination"
                unoptimized
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="grid gap-3">
              <div
                className="
            text-2xl font-semibold"
              >
                {x.title}
              </div>
              <div className="font-medium">{x.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
