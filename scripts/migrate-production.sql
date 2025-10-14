-- Script SQL para Migração de Produção
-- Execute este script diretamente no seu banco PostgreSQL de produção

-- 1. Adicionar coluna equipe na tabela users (se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'equipe'
    ) THEN
        ALTER TABLE users ADD COLUMN equipe VARCHAR(50);
        RAISE NOTICE 'Coluna equipe adicionada à tabela users';
    ELSE
        RAISE NOTICE 'Coluna equipe já existe na tabela users';
    END IF;
END $$;

-- 2. Adicionar coluna isLancamento na tabela properties (se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' AND column_name = 'isLancamento'
    ) THEN
        ALTER TABLE properties ADD COLUMN isLancamento BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Coluna isLancamento adicionada à tabela properties';
    ELSE
        RAISE NOTICE 'Coluna isLancamento já existe na tabela properties';
    END IF;
END $$;

-- 3. Atualizar usuários existentes com equipe padrão
UPDATE users 
SET equipe = 'Lopes Marista' 
WHERE role = 'corretor' 
AND (equipe IS NULL OR equipe = '');

-- 4. Criar constraint de validação de equipe (se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'check_equipe_valid'
    ) THEN
        ALTER TABLE users 
        ADD CONSTRAINT check_equipe_valid 
        CHECK (equipe IS NULL OR equipe IN ('Lopes Marista', 'Lopes Bueno', 'Lopes Jardim Goias'));
        RAISE NOTICE 'Constraint de equipe válida criada';
    ELSE
        RAISE NOTICE 'Constraint de equipe válida já existe';
    END IF;
END $$;

-- 5. Verificar resultado
SELECT 
    'users' as tabela,
    COUNT(*) as total_registros,
    COUNT(equipe) as com_equipe,
    COUNT(*) - COUNT(equipe) as sem_equipe
FROM users
UNION ALL
SELECT 
    'properties' as tabela,
    COUNT(*) as total_registros,
    COUNT(isLancamento) as com_lancamento,
    COUNT(*) - COUNT(isLancamento) as sem_lancamento
FROM properties;

-- 6. Mostrar usuários e suas equipes
SELECT 
    id,
    name,
    email,
    role,
    equipe,
    active,
    created_at
FROM users 
ORDER BY created_at DESC;
