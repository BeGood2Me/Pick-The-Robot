'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { HOME_BENEFITS } from '@/lib/content/home-landing';

const EASE = [0.32, 0.72, 0, 1] as const;

export function HomeBenefits() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="mb-12 sm:mb-16" aria-labelledby="home-benefits-heading">
      <h2 id="home-benefits-heading" className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        What you get
      </h2>
      <p className="mt-2 max-w-2xl text-base text-pretty text-ink-muted">
        A practical shortlist from your facility inputs — not another robotics blog.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-6">
        {HOME_BENEFITS.map((item, index) => (
          <motion.li
            key={item.title}
            className="card"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.7, ease: EASE, delay: reduceMotion ? 0 : index * 0.08 }}
          >
            <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 text-sm text-pretty text-ink-muted">{item.body}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
