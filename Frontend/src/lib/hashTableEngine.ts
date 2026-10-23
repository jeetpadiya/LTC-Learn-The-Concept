import {
  HashBucket,
  HashCollisionStrategy,
  HashNode,
  HashTableTraceStep,
} from "@/types/visualizer";

export function createInitialBuckets(capacity: number = 7): HashBucket[] {
  const buckets: HashBucket[] = [];
  for (let i = 0; i < capacity; i++) {
    buckets.push({
      index: i,
      nodes: [],
      isOccupied: false,
      isTombstone: false,
      state: "default",
    });
  }
  return buckets;
}

function cloneBuckets(buckets: HashBucket[]): HashBucket[] {
  return buckets.map((b) => ({
    ...b,
    nodes: b.nodes.map((n) => ({ ...n })),
  }));
}

export function hashFn(key: number, capacity: number): number {
  return ((key % capacity) + capacity) % capacity;
}

export function countKeys(buckets: HashBucket[], strategy: HashCollisionStrategy): number {
  if (strategy === "chaining") {
    return buckets.reduce((acc, b) => acc + b.nodes.length, 0);
  }
  return buckets.filter((b) => b.isOccupied && !b.isTombstone && b.nodes.length > 0).length;
}

// ==========================================
// 1. INSERTION (Chaining & Linear Probing)
// ==========================================
export function generateInsertTrace(
  currentBuckets: HashBucket[],
  capacity: number,
  key: number,
  strategy: HashCollisionStrategy
): HashTableTraceStep[] {
  const steps: HashTableTraceStep[] = [];
  const buckets = cloneBuckets(currentBuckets);
  const initialKeyCount = countKeys(buckets, strategy);
  const h = hashFn(key, capacity);

  // Step 0: Hash Computation
  buckets[h].state = "target";
  steps.push({
    stepIndex: 0,
    strategy,
    operation: "insert",
    buckets: cloneBuckets(buckets),
    capacity,
    keyCount: initialKeyCount,
    loadFactor: parseFloat((initialKeyCount / capacity).toFixed(2)),
    activeKey: key,
    computedHash: h,
    description: `Computed hash: h(${key}) = ${key} % ${capacity} = ${h}. Targeting bucket [${h}].`,
    reasoning: `Hash function distributes keys uniformly across ${capacity} buckets. Primary bucket is [${h}].`,
    codeLine: 2,
    inlineVariables: { key, capacity, hashIndex: h },
  });

  // Strategy A: SEPARATE CHAINING
  if (strategy === "chaining") {
    const bucket = buckets[h];
    const isCollision = bucket.nodes.length > 0;

    if (isCollision) {
      // Step A1: Collision detected!
      bucket.state = "collision";
      steps.push({
        stepIndex: steps.length,
        strategy,
        operation: "insert",
        buckets: cloneBuckets(buckets),
        capacity,
        keyCount: initialKeyCount,
        loadFactor: parseFloat((initialKeyCount / capacity).toFixed(2)),
        activeKey: key,
        computedHash: h,
        description: `Collision at bucket [${h}]! Slot already contains ${bucket.nodes.length} element(s).`,
        reasoning: `In Separate Chaining, collided keys share the same bucket by appending to its linked list chain.`,
        codeLine: 5,
        inlineVariables: { bucketIndex: h, existingChainLen: bucket.nodes.length },
      });
    }

    // Step A2: Append to linked list chain
    const newNode: HashNode = {
      id: `node-${key}-${Date.now().toString().slice(-4)}`,
      key,
      state: "inserted",
    };
    bucket.nodes.push(newNode);
    bucket.isOccupied = true;
    bucket.state = "default";

    const newKeyCount = initialKeyCount + 1;
    const newLoadFactor = parseFloat((newKeyCount / capacity).toFixed(2));

    steps.push({
      stepIndex: steps.length,
      strategy,
      operation: "insert",
      buckets: cloneBuckets(buckets),
      capacity,
      keyCount: newKeyCount,
      loadFactor: newLoadFactor,
      activeKey: key,
      computedHash: h,
      description: `Inserted ${key} into bucket [${h}] chain (New chain length: ${bucket.nodes.length}).`,
      reasoning: `Average insertion time is O(1). Load factor is now α = ${newKeyCount}/${capacity} = ${newLoadFactor} (Threshold: 0.75).`,
      codeLine: 7,
      inlineVariables: { newKeyCount, loadFactor: newLoadFactor, chainLength: bucket.nodes.length },
    });

    return steps;
  }

  // Strategy B: OPEN ADDRESSING (LINEAR PROBING)
  const probeSequence: number[] = [];
  let probe = h;
  let inserted = false;

  for (let attempt = 0; attempt < capacity; attempt++) {
    probe = (h + attempt) % capacity;
    probeSequence.push(probe);
    const b = buckets[probe];

    if (!b.isOccupied || b.isTombstone) {
      // Found available slot!
      b.isOccupied = true;
      b.isTombstone = false;
      b.nodes = [{ id: `node-${key}`, key, state: "inserted" }];
      b.state = "target";
      inserted = true;

      const newKeyCount = initialKeyCount + 1;
      const newLoadFactor = parseFloat((newKeyCount / capacity).toFixed(2));

      steps.push({
        stepIndex: steps.length,
        strategy,
        operation: "insert",
        buckets: cloneBuckets(buckets),
        capacity,
        keyCount: newKeyCount,
        loadFactor: newLoadFactor,
        activeKey: key,
        computedHash: h,
        probeSequence: [...probeSequence],
        description: attempt === 0
          ? `Bucket [${probe}] was empty. Inserted ${key} directly!`
          : `Found open slot at [${probe}] after ${attempt} probe step(s). Inserted ${key}!`,
        reasoning: attempt === 0
          ? `Slot [${probe}] was unoccupied. Direct O(1) write.`
          : `Linear probing resolved collision by advancing (h + ${attempt}) % ${capacity} = ${probe}.`,
        codeLine: 10,
        inlineVariables: { key, finalSlot: probe, attempts: attempt + 1, loadFactor: newLoadFactor },
      });
      break;
    } else {
      // Slot collision, probe next
      b.state = "collision";
      steps.push({
        stepIndex: steps.length,
        strategy,
        operation: "insert",
        buckets: cloneBuckets(buckets),
        capacity,
        keyCount: initialKeyCount,
        loadFactor: parseFloat((initialKeyCount / capacity).toFixed(2)),
        activeKey: key,
        computedHash: h,
        probeSequence: [...probeSequence],
        description: `Collision at slot [${probe}] (contains ${b.nodes[0]?.key}). Probing next: (${probe} + 1) % ${capacity} = ${(probe + 1) % capacity}.`,
        reasoning: `Linear Probing rule: if slot is occupied, probe contiguous slots in order until an empty slot or tombstone is encountered.`,
        codeLine: 8,
        inlineVariables: { occupiedSlot: probe, nextProbe: (probe + 1) % capacity },
      });
      b.state = "default";
    }
  }

  if (!inserted) {
    steps.push({
      stepIndex: steps.length,
      strategy,
      operation: "insert",
      buckets: cloneBuckets(buckets),
      capacity,
      keyCount: initialKeyCount,
      loadFactor: 1.0,
      activeKey: key,
      description: `Hash Table FULL! Could not insert ${key}.`,
      reasoning: "Capacity 100% saturated. Dynamic Rehashing required.",
      codeLine: 12,
      inlineVariables: { error: "TABLE_FULL" },
    });
  }

  return steps;
}

// ==========================================
// 2. SEARCH / LOOKUP (O(1) Avg, O(n) Worst)
// ==========================================
export function generateSearchTrace(
  currentBuckets: HashBucket[],
  capacity: number,
  targetKey: number,
  strategy: HashCollisionStrategy
): HashTableTraceStep[] {
  const steps: HashTableTraceStep[] = [];
  const buckets = cloneBuckets(currentBuckets);
  const keyCount = countKeys(buckets, strategy);
  const h = hashFn(targetKey, capacity);

  // Step 0: Hash computation
  buckets[h].state = "target";
  steps.push({
    stepIndex: 0,
    strategy,
    operation: "search",
    buckets: cloneBuckets(buckets),
    capacity,
    keyCount,
    loadFactor: parseFloat((keyCount / capacity).toFixed(2)),
    activeKey: targetKey,
    computedHash: h,
    description: `Lookup ${targetKey}: Computed primary bucket h(${targetKey}) = ${targetKey} % ${capacity} = ${h}.`,
    reasoning: `Search begins at primary hash slot [${h}] in strictly O(1) time.`,
    codeLine: 2,
    inlineVariables: { targetKey, initialHash: h },
  });

  if (strategy === "chaining") {
    const bucket = buckets[h];
    let found = false;

    for (let i = 0; i < bucket.nodes.length; i++) {
      const node = bucket.nodes[i];
      node.state = "comparing";

      steps.push({
        stepIndex: steps.length,
        strategy,
        operation: "search",
        buckets: cloneBuckets(buckets),
        capacity,
        keyCount,
        loadFactor: parseFloat((keyCount / capacity).toFixed(2)),
        activeKey: targetKey,
        computedHash: h,
        description: `Inspecting node [${i}] in bucket [${h}] chain: key = ${node.key}.`,
        reasoning: `Traversing linked list chain for bucket [${h}]. Comparing node key (${node.key}) with target (${targetKey}).`,
        codeLine: 4,
        inlineVariables: { chainIndex: i, nodeKey: node.key, targetKey },
      });

      if (node.key === targetKey) {
        node.state = "active";
        found = true;
        steps.push({
          stepIndex: steps.length,
          strategy,
          operation: "search",
          buckets: cloneBuckets(buckets),
          capacity,
          keyCount,
          loadFactor: parseFloat((keyCount / capacity).toFixed(2)),
          activeKey: targetKey,
          computedHash: h,
          description: `Key ${targetKey} FOUND in bucket [${h}] chain at position ${i}!`,
          reasoning: `Search succeeded after ${i + 1} comparison(s). Expected chain length = α = ${parseFloat((keyCount / capacity).toFixed(2))}.`,
          codeLine: 5,
          inlineVariables: { foundAtBucket: h, chainDepth: i },
        });
        break;
      }
      node.state = "default";
    }

    if (!found) {
      steps.push({
        stepIndex: steps.length,
        strategy,
        operation: "search",
        buckets: cloneBuckets(buckets),
        capacity,
        keyCount,
        loadFactor: parseFloat((keyCount / capacity).toFixed(2)),
        activeKey: targetKey,
        computedHash: h,
        description: `Key ${targetKey} NOT FOUND in bucket [${h}] chain.`,
        reasoning: `Reached end of chain without finding target. Key is absent from table.`,
        codeLine: 6,
        inlineVariables: { searchResult: "NOT_FOUND" },
      });
    }

    return steps;
  }

  // Strategy: LINEAR PROBING
  const probeSequence: number[] = [];
  let found = false;

  for (let attempt = 0; attempt < capacity; attempt++) {
    const probe = (h + attempt) % capacity;
    probeSequence.push(probe);
    const b = buckets[probe];

    if (!b.isOccupied && !b.isTombstone) {
      // Hit an empty slot: stop!
      steps.push({
        stepIndex: steps.length,
        strategy,
        operation: "search",
        buckets: cloneBuckets(buckets),
        capacity,
        keyCount,
        loadFactor: parseFloat((keyCount / capacity).toFixed(2)),
        activeKey: targetKey,
        computedHash: h,
        probeSequence: [...probeSequence],
        description: `Slot [${probe}] is EMPTY. Search terminated: Key ${targetKey} NOT FOUND.`,
        reasoning: `Because elements are inserted continuously along the probe chain, hitting an empty slot guarantees the key does not exist.`,
        codeLine: 6,
        inlineVariables: { searchResult: "NOT_FOUND", emptySlotHit: probe },
      });
      break;
    }

    b.state = "comparing";
    steps.push({
      stepIndex: steps.length,
      strategy,
      operation: "search",
      buckets: cloneBuckets(buckets),
      capacity,
      keyCount,
      loadFactor: parseFloat((keyCount / capacity).toFixed(2)),
      activeKey: targetKey,
      computedHash: h,
      probeSequence: [...probeSequence],
      description: b.isTombstone
        ? `Slot [${probe}] has a TOMBSTONE [DEL]. Skipping to next probe...`
        : `Inspecting slot [${probe}]: key = ${b.nodes[0]?.key}.`,
      reasoning: b.isTombstone
        ? `Tombstones must be skipped during search so they don't prematurely terminate the probe sequence.`
        : `Comparing probed element (${b.nodes[0]?.key}) with target (${targetKey}).`,
      codeLine: 4,
      inlineVariables: { probeIndex: probe, slotKey: b.nodes[0]?.key ?? "DEL" },
    });

    if (!b.isTombstone && b.nodes[0]?.key === targetKey) {
      b.state = "active";
      found = true;
      steps.push({
        stepIndex: steps.length,
        strategy,
        operation: "search",
        buckets: cloneBuckets(buckets),
        capacity,
        keyCount,
        loadFactor: parseFloat((keyCount / capacity).toFixed(2)),
        activeKey: targetKey,
        computedHash: h,
        probeSequence: [...probeSequence],
        description: `Key ${targetKey} FOUND at slot [${probe}] after ${attempt + 1} probe(s)!`,
        reasoning: `Search successful. Probed ${attempt + 1} slot(s). Total time = O(1) on average.`,
        codeLine: 5,
        inlineVariables: { foundAtSlot: probe, totalProbes: attempt + 1 },
      });
      break;
    }

    b.state = "default";
  }

  return steps;
}

// ==========================================
// 3. DELETION (Tombstone vs Unlink)
// ==========================================
export function generateDeleteTrace(
  currentBuckets: HashBucket[],
  capacity: number,
  targetKey: number,
  strategy: HashCollisionStrategy
): HashTableTraceStep[] {
  const steps: HashTableTraceStep[] = [];
  const buckets = cloneBuckets(currentBuckets);
  const initialKeyCount = countKeys(buckets, strategy);
  const h = hashFn(targetKey, capacity);

  if (strategy === "chaining") {
    const bucket = buckets[h];
    const idx = bucket.nodes.findIndex((n) => n.key === targetKey);

    if (idx !== -1) {
      bucket.nodes[idx].state = "deleted";
      steps.push({
        stepIndex: 0,
        strategy,
        operation: "delete",
        buckets: cloneBuckets(buckets),
        capacity,
        keyCount: initialKeyCount,
        loadFactor: parseFloat((initialKeyCount / capacity).toFixed(2)),
        activeKey: targetKey,
        computedHash: h,
        description: `Found key ${targetKey} in bucket [${h}] chain. Unlinking node...`,
        reasoning: `In Separate Chaining, deletion simply splices out the node from the linked list chain in O(1) time.`,
        codeLine: 3,
        inlineVariables: { bucketIndex: h, targetKey },
      });

      bucket.nodes.splice(idx, 1);
      if (bucket.nodes.length === 0) bucket.isOccupied = false;

      const newKeyCount = initialKeyCount - 1;
      steps.push({
        stepIndex: 1,
        strategy,
        operation: "delete",
        buckets: cloneBuckets(buckets),
        capacity,
        keyCount: newKeyCount,
        loadFactor: parseFloat((newKeyCount / capacity).toFixed(2)),
        activeKey: targetKey,
        computedHash: h,
        description: `Deleted ${targetKey} from bucket [${h}]! Remaining chain length: ${bucket.nodes.length}.`,
        reasoning: `Deletion complete. Memory unlinked. Remaining keys in table: ${newKeyCount}.`,
        codeLine: 5,
        inlineVariables: { newKeyCount },
      });
    } else {
      steps.push({
        stepIndex: 0,
        strategy,
        operation: "delete",
        buckets: cloneBuckets(buckets),
        capacity,
        keyCount: initialKeyCount,
        loadFactor: parseFloat((initialKeyCount / capacity).toFixed(2)),
        activeKey: targetKey,
        computedHash: h,
        description: `Key ${targetKey} not found. Cannot delete.`,
        reasoning: "Key not present in target bucket.",
        codeLine: 1,
        inlineVariables: { error: "NOT_FOUND" },
      });
    }

    return steps;
  }

  // LINEAR PROBING: TOMBSTONE REQUIRED!
  let probe = h;
  let found = false;

  for (let attempt = 0; attempt < capacity; attempt++) {
    probe = (h + attempt) % capacity;
    const b = buckets[probe];

    if (!b.isOccupied && !b.isTombstone) break;

    if (!b.isTombstone && b.nodes[0]?.key === targetKey) {
      found = true;
      // Mark as Tombstone
      b.isOccupied = true;
      b.isTombstone = true;
      b.nodes = [{ id: `tombstone-${probe}`, key: targetKey, state: "tombstone" }];
      b.state = "target";

      const newKeyCount = initialKeyCount - 1;
      steps.push({
        stepIndex: 0,
        strategy,
        operation: "delete",
        buckets: cloneBuckets(buckets),
        capacity,
        keyCount: newKeyCount,
        loadFactor: parseFloat((newKeyCount / capacity).toFixed(2)),
        activeKey: targetKey,
        computedHash: h,
        description: `Deleted ${targetKey} at slot [${probe}]. Marked slot as TOMBSTONE [DEL]!`,
        reasoning: `Crucial Invariant: In Open Addressing, slots must be marked with a Tombstone instead of being set to empty. Otherwise, subsequent searches for collided keys would terminate early and incorrectly report 'not found'!`,
        codeLine: 4,
        inlineVariables: { deletedAtSlot: probe, tombstonePlaced: "true", remainingKeys: newKeyCount },
      });
      break;
    }
  }

  if (!found) {
    steps.push({
      stepIndex: 0,
      strategy,
      operation: "delete",
      buckets: cloneBuckets(buckets),
      capacity,
      keyCount: initialKeyCount,
      loadFactor: parseFloat((initialKeyCount / capacity).toFixed(2)),
      activeKey: targetKey,
      computedHash: h,
      description: `Key ${targetKey} not found in probe sequence. Nothing deleted.`,
      reasoning: "Target key does not exist.",
      codeLine: 1,
      inlineVariables: { error: "NOT_FOUND" },
    });
  }

  return steps;
}

// ==========================================
// 4. DYNAMIC REHASHING (2× Capacity)
// ==========================================
export function generateRehashTrace(
  currentBuckets: HashBucket[],
  oldCapacity: number,
  strategy: HashCollisionStrategy
): HashTableTraceStep[] {
  const steps: HashTableTraceStep[] = [];
  const newCapacity = oldCapacity * 2;
  const oldBuckets = cloneBuckets(currentBuckets);

  // Extract all valid keys
  const keys: number[] = [];
  currentBuckets.forEach((b) => {
    if (strategy === "chaining") {
      b.nodes.forEach((n) => keys.push(n.key));
    } else {
      if (b.isOccupied && !b.isTombstone && b.nodes[0]) {
        keys.push(b.nodes[0].key);
      }
    }
  });

  const newBuckets = createInitialBuckets(newCapacity);

  // Step 0: Rehashing Triggered
  steps.push({
    stepIndex: 0,
    strategy,
    operation: "rehash",
    buckets: cloneBuckets(oldBuckets),
    oldBuckets: cloneBuckets(oldBuckets),
    capacity: oldCapacity,
    keyCount: keys.length,
    loadFactor: parseFloat((keys.length / oldCapacity).toFixed(2)),
    description: `Load Factor α = ${(keys.length / oldCapacity).toFixed(2)} ≥ 0.75! Dynamic Rehashing triggered.`,
    reasoning: `When load factor exceeds threshold, performance degrades. Hash table doubles capacity (${oldCapacity} → ${newCapacity}) and re-hashes all keys.`,
    codeLine: 2,
    inlineVariables: { oldCapacity, newCapacity, keysToRehash: keys.length },
  });

  // Step 1: Allocate new empty table
  steps.push({
    stepIndex: 1,
    strategy,
    operation: "rehash",
    buckets: cloneBuckets(newBuckets),
    oldBuckets: cloneBuckets(oldBuckets),
    capacity: newCapacity,
    keyCount: 0,
    loadFactor: 0,
    description: `Allocated new bucket table with ${newCapacity} slots. Re-inserting elements...`,
    reasoning: `Each key will be re-hashed using the new modulus formula: h_new(k) = k % ${newCapacity}.`,
    codeLine: 4,
    inlineVariables: { newCapacity },
  });

  // Step 2: Re-insert each key into the new table
  let insertedCount = 0;
  for (const k of keys) {
    const newHash = hashFn(k, newCapacity);

    if (strategy === "chaining") {
      newBuckets[newHash].nodes.push({ id: `rehash-${k}`, key: k, state: "inserted" });
      newBuckets[newHash].isOccupied = true;
    } else {
      let p = newHash;
      while (newBuckets[p].isOccupied) {
        p = (p + 1) % newCapacity;
      }
      newBuckets[p].isOccupied = true;
      newBuckets[p].nodes = [{ id: `rehash-${k}`, key: k, state: "inserted" }];
    }

    insertedCount++;
    steps.push({
      stepIndex: steps.length,
      strategy,
      operation: "rehash",
      buckets: cloneBuckets(newBuckets),
      oldBuckets: cloneBuckets(oldBuckets),
      capacity: newCapacity,
      keyCount: insertedCount,
      loadFactor: parseFloat((insertedCount / newCapacity).toFixed(2)),
      activeKey: k,
      computedHash: newHash,
      description: `Rehashed key ${k}: h_new(${k}) = ${k} % ${newCapacity} = ${newHash}.`,
      reasoning: `Element placed at new address. Elements are now much more spread out across ${newCapacity} buckets.`,
      codeLine: 6,
      inlineVariables: { key: k, newHash, currentCount: insertedCount },
    });
  }

  // Final Step: Complete
  const finalLoad = parseFloat((keys.length / newCapacity).toFixed(2));
  steps.push({
    stepIndex: steps.length,
    strategy,
    operation: "rehash",
    buckets: cloneBuckets(newBuckets),
    capacity: newCapacity,
    keyCount: keys.length,
    loadFactor: finalLoad,
    description: `Rehashing COMPLETE! Table capacity doubled to ${newCapacity}. New Load Factor α = ${finalLoad}.`,
    reasoning: `Rehashing takes O(n) work amortized over many insertions, keeping subsequent operations at O(1) average time!`,
    codeLine: 8,
    inlineVariables: { newCapacity, finalLoadFactor: finalLoad },
  });

  return steps;
}
