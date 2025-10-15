import Spline from "@splinetool/react-spline/next";

type Props = {
  className?: string;
};
export default function SplineVector({ className }: Props) {
  return (
    <>
      <div className={`${className}  `}>
        <Spline scene="https://prod.spline.design/9hXnegEUuDhD3v0P/scene.splinecode" />
      </div>
    </>
  );
}
