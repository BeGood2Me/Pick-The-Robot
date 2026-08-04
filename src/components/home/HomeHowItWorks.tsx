import { HOME_HOW_IT_WORKS } from '@/lib/content/home-landing';

export function HomeHowItWorks() {
  return (
    <section className="mb-12 sm:mb-16" aria-labelledby="home-how-heading">
      <h2 id="home-how-heading" className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        {HOME_HOW_IT_WORKS.title}
      </h2>
      <ol className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-6">
        {HOME_HOW_IT_WORKS.steps.map((step, index) => (
          <li key={step.title} className="card">
            <p className="text-sm font-semibold text-accent">Step {index + 1}</p>
            <h3 className="mt-2 text-lg font-semibold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm text-pretty text-ink-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
