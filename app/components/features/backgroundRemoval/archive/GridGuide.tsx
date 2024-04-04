import { cn } from '~core/ui/utils';

interface GridGuideProps extends React.ComponentPropsWithoutRef<'div'> {
  x: number;
  y: number;
  className: string;
}

const GridGuide = ({ x, y, className, style, ...rest }: GridGuideProps) => {
  const matrix = Array(x).fill(Array(y).fill(0)) as number[][];
  return (
    <div
      data-label="Grid guide"
      aria-hidden
      className={cn('grid grid-cols-8 grid-rows-8', className)}
      style={{
        '--rows': x,
        '--cols': y,
        ...style,
      }}
      {...rest}
    >
      {matrix.map((row, index) => {
        const _x = index + 1;

        return row.map((col, index) => {
          const _y = index + 1;
          return (
            <div
              className="col-start-[var(--x)] col-end-1 row-start-[var(--y)] row-end-1 self-stretch border-1 border-[var(--guide-color)]"
              key={`x-${_x}-y-${_y}`}
              style={{
                '--x': _x,
                '--y': _y,
              }}
            />
          );
        });
      })}
    </div>
  );
};

export default GridGuide;
