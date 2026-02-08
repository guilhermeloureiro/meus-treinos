-- Seed data with the 5 workout plans

DO $$
DECLARE
  treino1_id UUID;
  treino2_id UUID;
  treino3_id UUID;
  treino4_id UUID;
  treino5_id UUID;
BEGIN
  -- TREINO 1 (Bíceps + Peitoral + Abdômen)
  INSERT INTO workouts (title, description, day_of_week, position) 
  VALUES ('Treino 1 - Bíceps e Peitoral', 'Bíceps, Peitoral e Abdômen', 1, 1)
  RETURNING id INTO treino1_id;

  INSERT INTO exercises (workout_id, name, sets, reps, weight_hint, notes, position) VALUES
  (treino1_id, 'Rosca direta', 5, '15-20 / até queimar / falha', '30% → 50% → 100%', 'Drop set na última série', 1),
  (treino1_id, 'Rosca Scott máquina', 4, 'até queimar / falha', '50% → 100%', 'Drop set na última série', 2),
  (treino1_id, 'Rosca unilateral de costas', 3, 'próximo da falha', '100%', 'Rest pause na última série', 3),
  (treino1_id, 'Manguito rotador', 2, 'aquecimento', 'Leve', 'Aquecimento', 4),
  (treino1_id, 'Supino máquina', 5, '15-20 / até queimar / falha', '30% → 50% → 100%', 'Cluster Set na última série', 5),
  (treino1_id, 'Dumbbell press 30º', 4, 'até queimar / falha', '50% → 100%', 'Drop set na última série', 6),
  (treino1_id, 'Cross over em baixo', 4, 'até queimar / falha', '50% → 100%', 'Flexão de braço na última série', 7),
  (treino1_id, 'Crucifixo máquina', 3, 'próximo da falha', '100%', 'Contração de pico + falha', 8),
  (treino1_id, 'Abdômen máquina', 4, 'até queimar / falha', '50% → 100%', 'Drop set na última série', 9);

  -- TREINO 2 (Tríceps e Costas)
  INSERT INTO workouts (title, description, day_of_week, position) 
  VALUES ('Treino 2 - Tríceps e Costas', 'Tríceps e Costas', 2, 2)
  RETURNING id INTO treino2_id;

  INSERT INTO exercises (workout_id, name, sets, reps, weight_hint, notes, position) VALUES
  (treino2_id, 'Tríceps testa na polia alta', 5, '15-20 / até queimar / falha', '30% → 50% → 100%', 'Drop set na última série', 1),
  (treino2_id, 'Tríceps pulley com corda', 4, 'até queimar / falha', '50% → 100%', 'Contração de pico + falha', 2),
  (treino2_id, 'Tríceps Francês unilateral', 4, 'até queimar / falha', '50% → 100%', 'Até a falha', 3),
  (treino2_id, 'Pulley frente', 5, '15-20 / até queimar / falha', '30% → 50% → 100%', 'Cluster Set na última série', 4),
  (treino2_id, 'Remada do Lalá', 4, 'até queimar / falha', '50% → 100%', 'Drop set na última série', 5),
  (treino2_id, 'Pulley frente supinado', 4, 'até queimar / falha', '50% → 100%', 'Drop set na última série', 6),
  (treino2_id, 'Crucifixo inverso na máquina', 4, 'até queimar / falha', '50% → 100%', 'Drop set na última série', 7);

  -- TREINO 3 (Pernas)
  INSERT INTO workouts (title, description, day_of_week, position) 
  VALUES ('Treino 3 - Pernas', 'Quadríceps e Panturrilha', 3, 3)
  RETURNING id INTO treino3_id;

  INSERT INTO exercises (workout_id, name, sets, reps, weight_hint, notes, position) VALUES
  (treino3_id, 'Agachamento livre', 5, '15-20 / até queimar / falha', '30% → 50% → 100%', 'Próximo da falha', 1),
  (treino3_id, 'Leg press', 5, '15-20 / até queimar / falha', '30% → 50% → 100%', 'Cluster Set na última série', 2),
  (treino3_id, 'Cadeira extensora', 4, 'até queimar / falha', '50% → 100%', 'Drop set na última série', 3),
  (treino3_id, 'Panturrilha em pé', 4, 'até queimar / falha', '50% → 100%', 'Drop set na última série', 4),
  (treino3_id, 'Panturrilha sentado', 4, 'até queimar / falha', '50% → 100%', 'Drop set + parciais', 5),
  (treino3_id, 'Panturrilha no Leg press', 4, 'até queimar / falha', '50% → 100%', 'Parciais na última série', 6);

  -- TREINO 4 (Posterior e Ombros)
  INSERT INTO workouts (title, description, day_of_week, position) 
  VALUES ('Treino 4 - Posterior e Ombros', 'Posterior da Coxa e Deltóide Medial', 4, 4)
  RETURNING id INTO treino4_id;

  INSERT INTO exercises (workout_id, name, sets, reps, weight_hint, notes, position) VALUES
  (treino4_id, 'Mesa Flexora', 5, '15-20 / até queimar / falha', '30% → 50% → 100%', 'Drop set na última série', 1),
  (treino4_id, 'Cadeira Flexora', 4, 'até queimar / falha', '50% → 100%', 'Drop set na última série', 2),
  (treino4_id, 'Stiff', 4, 'até queimar / falha', '50% → 100%', 'Drop set na última série', 3),
  (treino4_id, 'Elevação diagonal', 5, '15-20 / até queimar / falha', '30% → 50% → 100%', 'Drop set na última série', 4),
  (treino4_id, 'Elevação lateral unilateral na polia média', 4, 'até queimar / falha', '50% → 100%', 'Drop set na última série', 5),
  (treino4_id, 'Elevação lateral máquina', 4, 'até queimar / falha', '50% → 100%', 'Contração de pico + Drop set + parciais', 6);

  -- TREINO 5 (Full Body)
  INSERT INTO workouts (title, description, day_of_week, position) 
  VALUES ('Treino 5 - Full Body', 'Costas, Peitoral, Bíceps, Tríceps e Abdômen', 5, 5)
  RETURNING id INTO treino5_id;

  INSERT INTO exercises (workout_id, name, sets, reps, weight_hint, notes, position) VALUES
  (treino5_id, 'Pulley frente com triângulo', 5, '15-20 / até queimar / falha', '30% → 50% → 100%', 'Drop set na última série', 1),
  (treino5_id, 'Dumbbell press reto', 5, '15-20 / até queimar / falha', '30% → 50% → 100%', 'Até a falha', 2),
  (treino5_id, 'Pull over', 5, '15-20 / até queimar / falha', '30% → 50% → 100%', 'Até a falha', 3),
  (treino5_id, 'Rosca simultânea', 5, '15-20 / até queimar / falha', '30% → 50% → 100%', 'Drop mecânico na última série', 4),
  (treino5_id, 'Tríceps testa na polia alta com corda', 5, '15-20 / até queimar / falha', '30% → 50% → 100%', 'Drop mecânico na última série', 5),
  (treino5_id, 'Abdominal máquina', 4, 'até queimar / falha', '50% → 100%', 'Até a falha', 6);

END $$;

