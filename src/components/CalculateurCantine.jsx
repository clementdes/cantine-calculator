{
  `path`: `src/components/CalculateurCantine.jsx`,
  `repo`: `cantine-calculator`,
  `owner`: `clementdes`,
  `branch`: `main`,
  `content`: `import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CalculateurCantine = () => {
  const [inputs, setInputs] = useState({
    service1BasMaternelle: 15,
    service1HautMaternelle: 29,
    service1HautPrimaire: 10,
    service2HautPrimaire: 45,
    quantiteMaternelle: 160,
    quantitePrimaire: 225,
    totalGN1: 3600,
    totalGN2: 1800,
    totalGN3: 1200,
    totalGN4: 900
  });

  const [results, setResults] = useState({
    service1Bas: 0,
    service1Haut: 0,
    service2Haut: 0,
    totalMaternelle: 0,
    totalPrimaire: 0,
    total: 0,
    bacsService1: {
      GN1: 0,
      GN1Half: 0,
      GN3: 0,
      GN4: 0,
      totalQuantity: 0,
      targetQuantity: 0,
      difference: 0
    },
    bacsService1Haut: {
      GN1: 0,
      GN1Half: 0,
      GN3: 0,
      GN4: 0,
      totalQuantity: 0,
      targetQuantity: 0,
      difference: 0
    },
    bacsService2: {
      GN1: 0,
      GN1Half: 0,
      GN3: 0,
      GN4: 0,
      totalQuantity: 0,
      targetQuantity: 0,
      difference: 0
    }
  });

  const handleInputChange = (name, value) => {
    setInputs(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const calculateBacsNeeded = (targetQuantity, bacsConfig) => {
    const { totalGN1, totalGN3, totalGN4 } = bacsConfig;
    
    if (!totalGN1 || totalGN1 <= 0) {
      return {
        GN1: 0,
        GN1Half: 0,
        GN3: 0,
        GN4: 0,
        totalQuantity: 0,
        targetQuantity,
        difference: targetQuantity
      };
    }

    const capacityPerBacGN1 = totalGN1;
    const capacityHalfGN1 = totalGN1 / 2;
    const capacityPerBacGN3 = totalGN3 || 0;
    const capacityPerBacGN4 = totalGN4 || 0;

    const fullGN1Bacs = Math.floor(targetQuantity / capacityPerBacGN1);
    let remainingQuantity = targetQuantity - (fullGN1Bacs * capacityPerBacGN1);
    
    let halfGN1Bacs = 0;
    if (remainingQuantity > 0 && capacityHalfGN1 > 0) {
      halfGN1Bacs = Math.floor(remainingQuantity / capacityHalfGN1);
      remainingQuantity -= halfGN1Bacs * capacityHalfGN1;
    }

    let neededGN3 = 0;
    if (remainingQuantity > 0 && capacityPerBacGN3 > 0) {
      neededGN3 = Math.floor(remainingQuantity / capacityPerBacGN3);
      remainingQuantity -= neededGN3 * capacityPerBacGN3;
    }

    let neededGN4 = 0;
    if (remainingQuantity > 0 && capacityPerBacGN4 > 0) {
      neededGN4 = Math.ceil(remainingQuantity / capacityPerBacGN4);
    }

    const totalQuantity = (fullGN1Bacs * capacityPerBacGN1) + 
                         (halfGN1Bacs * capacityHalfGN1) + 
                         (neededGN3 * capacityPerBacGN3) + 
                         (neededGN4 * capacityPerBacGN4);

    return {
      GN1: fullGN1Bacs,
      GN1Half: halfGN1Bacs,
      GN3: neededGN3,
      GN4: neededGN4,
      totalQuantity,
      targetQuantity,
      difference: Math.abs(targetQuantity - totalQuantity)
    };
  };

  useEffect(() => {
    const service1BasTotal = inputs.service1BasMaternelle * inputs.quantiteMaternelle;
    const service1HautMaternelleTotal = inputs.service1HautMaternelle * inputs.quantiteMaternelle;
    const service1HautPrimaireTotal = inputs.service1HautPrimaire * inputs.quantitePrimaire;
    const service2HautTotal = inputs.service2HautPrimaire * inputs.quantitePrimaire;

    const totalMaternelle = (inputs.service1BasMaternelle + inputs.service1HautMaternelle) * inputs.quantiteMaternelle;
    const totalPrimaire = (inputs.service1HautPrimaire + inputs.service2HautPrimaire) * inputs.quantitePrimaire;
    const service1HautTotal = service1HautMaternelleTotal + service1HautPrimaireTotal;

    const bacsService1 = calculateBacsNeeded(service1BasTotal, inputs);
    const bacsService1Haut = calculateBacsNeeded(service1HautTotal, inputs);
    const bacsService2 = calculateBacsNeeded(service2HautTotal, inputs);

    setResults({
      service1Bas: service1BasTotal,
      service1Haut: service1HautTotal,
      service2Haut: service2HautTotal,
      totalMaternelle,
      totalPrimaire,
      total: totalMaternelle + totalPrimaire,
      bacsService1,
      bacsService1Haut,
      bacsService2
    });
  }, [inputs]);

  return (
    <div className=\"w-full max-w-4xl mx-auto p-4 space-y-6\">
      <Card>
        <CardHeader>
          <CardTitle>Calculateur de portions - Cantine Kerfeunteun</CardTitle>
        </CardHeader>
        <CardContent className=\"space-y-6\">
          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\">
            <div className=\"space-y-4\">
              <h3 className=\"font-semibold text-lg\">Paramètres par élève</h3>
              <div>
                <Label>Quantité Maternelle (gr)</Label>
                <Input
                  type=\"number\"
                  value={inputs.quantiteMaternelle}
                  onChange={(e) => handleInputChange('quantiteMaternelle', e.target.value)}
                />
              </div>
              <div>
                <Label>Quantité Primaire (gr)</Label>
                <Input
                  type=\"number\"
                  value={inputs.quantitePrimaire}
                  onChange={(e) => handleInputChange('quantitePrimaire', e.target.value)}
                />
              </div>
            </div>

            <div className=\"space-y-4\">
              <h3 className=\"font-semibold text-lg\">Nombre d'élèves</h3>
              <div>
                <Label>Service 1 - Salle bas (Maternelle)</Label>
                <Input
                  type=\"number\"
                  value={inputs.service1BasMaternelle}
                  onChange={(e) => handleInputChange('service1BasMaternelle', e.target.value)}
                />
              </div>
              <div>
                <Label>Service 1 - Salle haut (Maternelle)</Label>
                <Input
                  type=\"number\"
                  value={inputs.service1HautMaternelle}
                  onChange={(e) => handleInputChange('service1HautMaternelle', e.target.value)}
                />
              </div>
              <div>
                <Label>Service 1 - Salle haut (Primaire)</Label>
                <Input
                  type=\"number\"
                  value={inputs.service1HautPrimaire}
                  onChange={(e) => handleInputChange('service1HautPrimaire', e.target.value)}
                />
              </div>
              <div>
                <Label>Service 2 - Salle haut (Primaire)</Label>
                <Input
                  type=\"number\"
                  value={inputs.service2HautPrimaire}
                  onChange={(e) => handleInputChange('service2HautPrimaire', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className=\"space-y-4\">
            <h3 className=\"font-semibold text-lg\">Configuration des bacs gastro</h3>
            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
              <div className=\"space-y-2\">
                <Label>Quantité par bac GN 1/1 (gr)</Label>
                <Input
                  type=\"number\"
                  value={inputs.totalGN1}
                  onChange={(e) => handleInputChange('totalGN1', e.target.value)}
                />
              </div>
              <div className=\"space-y-2\">
                <Label>Quantité par bac GN 1/2 (gr)</Label>
                <Input
                  type=\"number\"
                  value={inputs.totalGN2}
                  onChange={(e) => handleInputChange('totalGN2', e.target.value)}
                />
              </div>
              <div className=\"space-y-2\">
                <Label>Quantité par bac GN 1/3 (gr)</Label>
                <Input
                  type=\"number\"
                  value={inputs.totalGN3}
                  onChange={(e) => handleInputChange('totalGN3', e.target.value)}
                />
              </div>
              <div className=\"space-y-2\">
                <Label>Quantité par bac GN 1/4 (gr)</Label>
                <Input
                  type=\"number\"
                  value={inputs.totalGN4}
                  onChange={(e) => handleInputChange('totalGN4', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className=\"mt-8 space-y-4\">
            <h3 className=\"font-semibold text-lg\">Résultats</h3>
            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg\">
              <div>
                <p className=\"font-medium\">Service 1 - Salle bas :</p>
                <p className=\"text-2xl text-blue-600\">{results.service1Bas} gr</p>
              </div>
              <div>
                <p className=\"font-medium\">Service 1 - Salle haut :</p>
                <p className=\"text-2xl text-blue-600\">{results.service1Haut} gr</p>
              </div>
              <div>
                <p className=\"font-medium\">Service 2 - Salle haut :</p>
                <p className=\"text-2xl text-blue-600\">{results.service2Haut} gr</p>
              </div>
              <div>
                <p className=\"font-medium\">Total nécessaire :</p>
                <p className=\"text-2xl text-green-600\">{results.total} gr</p>
              </div>
            </div>

            <div className=\"mt-6\">
              <h4 className=\"font-medium mb-2\">Bacs nécessaires - 1er Service - Salle du bas</h4>
              <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4 bg-blue-50 p-4 rounded-lg\">
                <div>
                  <p className=\"text-sm\">Bacs GN 1/1</p>
                  <p className=\"text-xl text-blue-600\">{results.bacsService1.GN1}</p>
                </div>
                <div>
                  <p className=\"text-sm\">Demi-bacs GN 1/1</p>
                  <p className=\"text-xl text-blue-600\">{results.bacsService1.GN1Half}</p>
                </div>
                <div>
                  <p className=\"text-sm\">Bacs GN 1/3</p>
                  <p className=\"text-xl text-blue-600\">{results.bacsService1.GN3}</p>
                </div>
                <div>
                  <p className=\"text-sm\">Bacs GN 1/4</p>
                  <p className=\"text-xl text-blue-600\">{results.bacsService1.GN4}</p>
                </div>
                <div>
                  <p className=\"text-sm\">Quantité totale</p>
                  <p className=\"text-xl text-blue-600\">{Math.round(results.bacsService1.totalQuantity)} gr</p>
                  <p className=\"text-xs text-gray-600\">
                    {results.bacsService1.difference > 0 
                      ? `Différence: ${Math.round(results.bacsService1.difference)} gr` 
                      : 'Quantité exacte'}
                  </p>
                </div>
              </div>
              
              <h4 className=\"font-medium mb-2 mt-4\">Bacs nécessaires - 1er Service - Salle du haut</h4>
              <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4 bg-blue-50 p-4 rounded-lg\">
                <div>
                  <p className=\"text-sm\">Bacs GN 1/1</p>
                  <p className=\"text-xl text-blue-600\">{results.bacsService1Haut.GN1}</p>
                </div>
                <div>
                  <p className=\"text-sm\">Demi-bacs GN 1/1</p>
                  <p className=\"text-xl text-blue-600\">{results.bacsService1Haut.G`,
  `message`: `Add CalculateurCantine component`
}
