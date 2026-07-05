import { cn } from '@/lib/utils';



const variants = {

  primary: 'bg-accent text-white hover:bg-accent-hover',

  secondary: 'bg-white text-ink border border-surface-border hover:bg-surface-soft',

  ghost: 'text-ink-muted hover:text-ink hover:bg-surface-soft',

} as const;



type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {

  variant?: keyof typeof variants;

};



export function Button({ className, variant = 'primary', ...props }: ButtonProps) {

  return (

    <button

      className={cn(

        'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50',

        variants[variant],

        className,

      )}

      {...props}

    />

  );

}



export function ButtonLink({

  href,

  className,

  variant = 'primary',

  children,

  ...props

}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {

  href: string;

  variant?: keyof typeof variants;

}) {

  return (

    <a

      href={href}

      className={cn(

        'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',

        variants[variant],

        className,

      )}

      {...props}

    >

      {children}

    </a>

  );

}


