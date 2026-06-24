import type { JSX } from "react";

import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";

import GitHubStats from "../components/GitHubStats";
import styles from "./index.module.css";

interface HeroBadge {
    readonly description: string;
    readonly label: string;
}

interface HeroStat {
    readonly description: string;
    readonly headline: string;
}

interface HomeCard {
    readonly description: string;
    readonly title: string;
    readonly to: string;
}

const heroBadges = [
    {
        description:
            "Flat config exports for ESLint v9+ and current TypeScript projects.",
        label: "Flat Config native",
    },
    {
        description:
            "Runs Yamllint without hiding its native diagnostics or configuration model.",
        label: "Yamllint bridge",
    },
    {
        description:
            "Adds focused config-authoring rules instead of recreating the full upstream config.",
        label: "Config policy",
    },
] as const satisfies readonly HeroBadge[];

const heroStats = [
    {
        description: "Runs Yamllint over YAML files through ESLint.",
        headline: "Yamllint bridge",
    },
    {
        description: "Adopt YAML diagnostics first, then config policy.",
        headline: "4 Presets",
    },
    {
        description: "Catches invalid levels, unknown keys, and drift.",
        headline: "Config guardrails",
    },
] as const satisfies readonly HeroStat[];

const packageName = "eslint-plugin-yamllint";
const homepageDescription =
    "Run Yamllint from ESLint, report YAML diagnostics in the same editor and CI stream, and enforce Yamllint config-file conventions alongside the rest of your lint stack.";
const homepageKeywords =
    "eslint, eslint-plugin, yamllint, yaml linting, configuration linting, flat config";
const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    codeRepository: `https://github.com/Nick2bad4u/${packageName}`,
    description: homepageDescription,
    image: `https://nick2bad4u.github.io/${packageName}/img/logo.png`,
    license: `https://github.com/Nick2bad4u/${packageName}/blob/main/LICENSE`,
    name: packageName,
    programmingLanguage: "TypeScript",
    runtimePlatform: "Node.js",
    url: `https://nick2bad4u.github.io/${packageName}/`,
} as const;
const homepageSocialImageUrl = `https://nick2bad4u.github.io/${packageName}/img/logo.png`;

const homeCards = [
    {
        description:
            "Install the plugin, enable a preset, and pass through only the upstream options you need.",
        title: "Get Started",
        to: "/docs/rules/getting-started",
    },
    {
        description:
            "Compare recommended, Yamllint-only, configuration, and all presets.",
        title: "Presets",
        to: "/docs/rules/presets",
    },
    {
        description:
            "Browse the bridge rule and config-authoring rules with concrete examples.",
        title: "Rule Reference",
        to: "/docs/rules",
    },
] as const satisfies readonly HomeCard[];

export default function Home(): JSX.Element {
    const logoSrc = useBaseUrl("/img/logo.svg");

    return (
        <Layout
            description={homepageDescription}
            title="YAML diagnostics inside ESLint"
        >
            <Head>
                <meta content={homepageKeywords} name="keywords" />
                <meta content={homepageSocialImageUrl} property="og:image" />
                <meta content="summary_large_image" name="twitter:card" />
                <meta content={homepageSocialImageUrl} name="twitter:image" />
                <script type="application/ld+json">
                    {JSON.stringify(homepageStructuredData)}
                </script>
            </Head>
            <header className={styles.heroBanner}>
                <div className={`container ${styles.heroContent}`}>
                    <div className={styles.heroGrid}>
                        <div>
                            <p className={styles.heroKicker}>
                                ESLint bridge for Yamllint
                            </p>
                            <Heading as="h1" className={styles.heroTitle}>
                                {packageName}
                            </Heading>
                            <p className={styles.heroSubtitle}>
                                {homepageDescription}
                            </p>

                            <div className={styles.heroBadgeRow}>
                                {heroBadges.map((badge) => (
                                    <article
                                        className={styles.heroBadge}
                                        key={badge.label}
                                    >
                                        <p className={styles.heroBadgeLabel}>
                                            {badge.label}
                                        </p>
                                        <p
                                            className={
                                                styles.heroBadgeDescription
                                            }
                                        >
                                            {badge.description}
                                        </p>
                                    </article>
                                ))}
                            </div>

                            <div className={styles.heroActions}>
                                <Link
                                    className={`button button--lg ${styles.heroActionButton} ${styles.heroActionPrimary}`}
                                    to="/docs/rules/overview"
                                >
                                    Start with Overview
                                </Link>
                                <Link
                                    className={`button button--lg ${styles.heroActionButton} ${styles.heroActionSecondary}`}
                                    to="/docs/rules/presets"
                                >
                                    Compare Presets
                                </Link>
                            </div>
                        </div>

                        <aside className={styles.heroPanel}>
                            <img
                                alt={`${packageName} logo`}
                                className={styles.heroPanelLogo}
                                decoding="async"
                                height="240"
                                loading="eager"
                                src={logoSrc}
                                width="240"
                            />
                            <div className={styles.heroPanelDetails}>
                                <span>.yamllint</span>
                                <span>yamllint/yamllint</span>
                                <span>yamllintOnly</span>
                            </div>
                        </aside>
                    </div>

                    <GitHubStats className={styles.heroLiveBadges} />

                    <div className={styles.heroStats}>
                        {heroStats.map((stat) => (
                            <article
                                className={styles.heroStatCard}
                                key={stat.headline}
                            >
                                <p className={styles.heroStatHeading}>
                                    {stat.headline}
                                </p>
                                <p className={styles.heroStatDescription}>
                                    {stat.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </header>

            <main className={styles.mainContent}>
                <section className="container">
                    <div className={styles.cardGrid}>
                        {homeCards.map((card) => (
                            <article className={styles.card} key={card.title}>
                                <Heading as="h2" className={styles.cardTitle}>
                                    {card.title}
                                </Heading>
                                <p className={styles.cardDescription}>
                                    {card.description}
                                </p>
                                <Link className={styles.cardLink} to={card.to}>
                                    Open section
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </Layout>
    );
}
