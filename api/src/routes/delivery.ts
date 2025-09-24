/**
 * @swagger
 * tags:
 *   name: Deliveries
 *   description: API endpoints for managing deliveries
 */

/**
 * @swagger
 * /api/deliveries:
 *   get:
 *     summary: Returns all deliveries
 *     tags: [Deliveries]
 *     responses:
 *       200:
 *         description: List of all deliveries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Delivery'
 *   post:
 *     summary: Create a new delivery
 *     tags: [Deliveries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       201:
 *         description: Delivery created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *
 * /api/deliveries/{id}:
 *   get:
 *     summary: Get a delivery by ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     responses:
 *       200:
 *         description: Delivery found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 *   put:
 *     summary: Update a delivery
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Delivery'
 *     responses:
 *       200:
 *         description: Delivery updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Delivery'
 *       404:
 *         description: Delivery not found
 *   delete:
 *     summary: Delete a delivery
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Delivery ID
 *     responses:
 *       204:
 *         description: Delivery deleted successfully
 *       404:
 *         description: Delivery not found
 */

import express from 'express';
import { Delivery } from '../models/delivery';
import { getDeliveriesRepository } from '../repositories/deliveriesRepo';
import { NotFoundError } from '../utils/errors';
import { exec } from 'child_process';

const router = express.Router();

// Create a new delivery
router.post('/', async (req, res, next) => {
  try {
    const repo = await getDeliveriesRepository();
    const newDelivery = await repo.create(req.body as Omit<Delivery, 'deliveryId'>);
    res.status(201).json(newDelivery);
  } catch (error) {
    next(error);
  }
});

// Get all deliveries
router.get('/', async (req, res, next) => {
  try {
    const repo = await getDeliveriesRepository();
    const deliveries = await repo.findAll();
    res.json(deliveries);
  } catch (error) {
    next(error);
  }
});

// Get a delivery by ID
router.get('/:id', async (req, res, next) => {
  try {
    const repo = await getDeliveriesRepository();
    const delivery = await repo.findById(parseInt(req.params.id));
    if (delivery) {
      res.json(delivery);
    } else {
      res.status(404).send('Delivery not found');
    }
  } catch (error) {
    next(error);
  }
});

// Update the status of a delivery
router.put('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const repo = await getDeliveriesRepository();
    const delivery = await repo.findById(parseInt(req.params.id));

    if (delivery) {
      const updatedDelivery = await repo.updateStatus(parseInt(req.params.id), status);
      res.json(updatedDelivery);
    } else {
      res.status(404).send('Delivery not found');
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send('Delivery not found');
    } else {
      next(error);
    }
  }
});

// Update a delivery by ID
router.put('/:id', async (req, res, next) => {
  try {
    const repo = await getDeliveriesRepository();
    const updatedDelivery = await repo.update(parseInt(req.params.id), req.body);
    res.json(updatedDelivery);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send('Delivery not found');
    } else {
      next(error);
    }
  }
});

// Delete a delivery by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const repo = await getDeliveriesRepository();
    await repo.delete(parseInt(req.params.id));
    res.status(204).send();
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).send('Delivery not found');
    } else {
      next(error);
    }
  }
});

export default router;
