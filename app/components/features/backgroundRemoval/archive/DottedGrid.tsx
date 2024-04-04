interface DottedGridProps extends React.ComponentPropsWithoutRef<'div'> {
  numberOfLines?: number | [number, number];
}

const DottedGrid = ({ className, style, numberOfLines = 4, ...rest }: DottedGridProps) => {
  const [x, y] = Array.isArray(numberOfLines) ? numberOfLines : [numberOfLines, numberOfLines];
  return (
    <div
      aria-hidden="true"
      style={{
        '--line-width': '1px',
        '--line-gap': '4px',
        '--line-color': '#222',
        ...style,
      }}
      {...rest}
      className={className}
    >
      <div className="absolute left-0 top-0 flex h-full w-full flex-col items-stretch justify-between">
        {Array.from({ length: x }).map((_, i) => (
          <hr
            key={i}
            data-orientation="horizontal"
            className="h-[var(--line-width)] w-full border-0 bg-gradient-to-r from-[var(--line-color)] via-[var(--line-color)] via-50%
              to-transparent to-50% bg-[length:var(--line-gap)_var(--line-width)] transition-all"
          />
        ))}
      </div>
      <div className="absolute left-0 top-0 flex h-full w-full items-stretch justify-between">
        {Array.from({ length: y }).map((_, i) => (
          <hr
            key={i}
            data-orientation="vertical"
            className="h-full w-[var(--line-width)] border-0 bg-gradient-to-b from-[var(--line-color)] via-[var(--line-color)] via-50%
              to-transparent to-50% bg-[length:var(--line-width)_var(--line-gap)] transition-all"
          />
        ))}
      </div>
    </div>
  );
};

export default DottedGrid;
