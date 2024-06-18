import React, { useState } from 'react';
import { addKompetensi } from '../../api/sekolah-api';

const AddKompetensiForm = () => {
  const [schoolId, setSchoolId] = useState('');
  const [kode, setKode] = useState('');
  const [unitKompetensiIds, setUnitKompetensiIds] = useState<string[]>([]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const unitKompetensi = unitKompetensiIds.map(id => ({ id }));
      const result = await addKompetensi(schoolId, kode, unitKompetensi);
      console.log('Kompetensi added:', result);
      alert('Kompetensi successfully added!');
    } catch (error) {
      console.error('Error adding kompetensi:', error);
      alert('Failed to add kompetensi.');
    }
  };

  const handleAddUnitId = (unitId: string) => {
    setUnitKompetensiIds([...unitKompetensiIds, unitId]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={schoolId}
        onChange={(e) => setSchoolId(e.target.value)}
        placeholder="School ID"
        required
      />
      <input
        type="text"
        value={kode}
        onChange={(e) => setKode(e.target.value)}
        placeholder="Kompetensi Code"
        required
      />
      <input
        type="text"
        placeholder="Unit Kompetensi ID"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const target = e.target as HTMLInputElement;
            handleAddUnitId(target.value);
            target.value = '';
          }
        }}
      />
      <ul>
        {unitKompetensiIds.map(id => (
          <li key={id}>{id}</li>
        ))}
      </ul>
      <button type="submit">Add Kompetensi</button>
    </form>
  );
};

export default AddKompetensiForm;
