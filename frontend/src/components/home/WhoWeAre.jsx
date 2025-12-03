import React from 'react';

const WhoWeAre = () => {
  const stats = [
    { value: '3 Regions', description: 'Operations in Middle East, India & SEA' },
    { value: '500+', description: 'global brands' },
    { value: '15,000+', description: 'employees of 67 nationalities' },
    { value: '#1 or 2', description: 'in each business sector we operate in' }
  ];

  return (
    <section className="bg-brand-gray-light py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-gray-dark">WHO WE ARE</h2>
          <p className="text-xl text-brand-gray mt-4">A Legacy of excellence</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Our Team"
              className="rounded-lg shadow-xl"
            />
          </div>
          <div className="text-brand-gray text-lg">
            <p className="mb-6">
              Alghanim Industries is one of the largest privately owned companies in the Gulf region. A multi-national, with operations around the world.
            </p>
            <div className="grid grid-cols-2 gap-8 mt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center md:text-left p-4 rounded-lg hover:bg-white transition-shadow hover:shadow-md">
                  <p className="text-3xl font-bold text-brand-blue">{stat.value}</p>
                  <p className="text-brand-gray">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
