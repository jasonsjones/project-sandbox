import React from 'react';

function About(): JSX.Element {
    return (
        <section className="max-w-none sm:max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-center sm:text-left">About</h3>
            <p className="leading-snug">
                A simple playground app to explore the technical benefits and project structure of a
                monorepo; and play around a bit with a few different core tech stacks.
            </p>
        </section>
    );
}

export default About;
