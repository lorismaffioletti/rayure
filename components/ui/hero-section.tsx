import { type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  title: string;
  titleHighlight?: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  visual?: ReactNode;
  className?: string;
}

export function HeroSection({
  title,
  titleHighlight,
  description,
  primaryAction,
  secondaryAction,
  visual,
  className,
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        'relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden',
        'gradient-hero dark:gradient-hero-dark',
        className
      )}
    >
      <div className="page relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
            {title}{' '}
            {titleHighlight && (
              <span className="inline-block px-4 py-2 rounded-full bg-primary text-primary-foreground text-4xl md:text-5xl lg:text-6xl">
                {titleHighlight}
              </span>
            )}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {description}
          </p>
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {primaryAction && (
                <Button size="lg" onClick={primaryAction.onClick}>
                  {primaryAction.label}
                </Button>
              )}
              {secondaryAction && (
                <Button variant="outline" size="lg" onClick={secondaryAction.onClick}>
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          )}
        </div>
        {visual && (
          <div className="mt-12 flex justify-center animate-float">{visual}</div>
        )}
      </div>
    </section>
  );
}

