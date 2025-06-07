module.exports = {
  hooks: {
    readPackage: (pkg) => {
      // Asegurar compatibilidad con Next.js y React
      if (pkg.name === "next" && pkg.dependencies) {
        // Configuraciones específicas para Next.js si es necesario
      }
      return pkg;
    },
  },
};
