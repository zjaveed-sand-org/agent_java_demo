/**
 * @swagger
 * tags:
 *   name: Headquarters
 *   description: API endpoints for managing headquarters locations
 */

/**
 * @swagger
 * /api/headquarters:
 *   get:
 *     summary: Returns all headquarters
 *     tags: [Headquarters]
 *     responses:
 *       200:
 *         description: List of all headquarters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Headquarters'
 *   post:
 *     summary: Create a new headquarters
 *     tags: [Headquarters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Headquarters'
 *     responses:
 *       201:
 *         description: Headquarters created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Headquarters'
 *
 * /api/headquarters/{id}:
 *   get:
 *     summary: Get a headquarters by ID
 *     tags: [Headquarters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Headquarters ID
 *     responses:
 *       200:
 *         description: Headquarters found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Headquarters'
 *       404:
 *         description: Headquarters not found
 *   put:
 *     summary: Update a headquarters
 *     tags: [Headquarters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Headquarters ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Headquarters'
 *     responses:
 *       200:
 *         description: Headquarters updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Headquarters'
 *       404:
 *         description: Headquarters not found
 *   delete:
 *     summary: Delete a headquarters
 *     tags: [Headquarters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Headquarters ID
 *     responses:
 *       204:
 *         description: Headquarters deleted successfully
 *       404:
 *         description: Headquarters not found
 */

import express from 'express';
import { Headquarters } from '../models/headquarters';
import { getHeadquartersRepository } from '../repositories/headquartersRepo';
import { NotFoundError } from '../utils/errors';

const router = express.Router();

// Create a new headquarters
router.post('/', async (req, res, next) => {
  try {
    const repo = await getHeadquartersRepository();
    const newHeadquarters = await repo.create(req.body as Omit<Headquarters, 'headquartersId'>);
    res.status(201).json(newHeadquarters);
  } catch (error) {
    next(error);
  }
});

// Get all headquarters
router.get('/', async (req, res, next) => {
  try {
    const repo = await getHeadquartersRepository();
    const headquarters = await repo.findAll();
    res.json(headquarters);
  } catch (error) {
    next(error);
  }
});

// Get a headquarters by ID
router.get('/:id', async (req, res, next) => {
  try {
    const repo = await getHeadquartersRepository();
    const headquarters = await repo.findById(parseInt(req.params.id));
    if (headquarters) {
      res.json(headquarters);
    } else {
      res.status(404).send('Headquarters not found');
    }
  } catch (error) {
    next(error);
  }
});

// Update a headquarters by ID
router.put('/:id', async (req, res, next) => {
  try {
    const repo = await getHeadquartersRepository();
    const updatedHeadquarters = await repo.update(parseInt(req.params.id), req.body);
    res.json(updatedHeadquarters);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send('Headquarters not found');
    } else {
      next(error);
    }
  }
});

// Delete a headquarters by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const repo = await getHeadquartersRepository();
    await repo.delete(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send('Headquarters not found');
    } else {
      next(error);
    }
  }
});

export default router;
