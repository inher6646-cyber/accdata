module {
  /// Identifier for every stored entity. Monotonic, assigned by the backend.
  public type Id = Nat;

  /// Point in time in nanoseconds since the Unix epoch (`Time.now()`).
  /// Stored as `Int` so timestamps sort naturally and can be compared directly.
  public type Timestamp = Int;

  /// Amount of money in whole Indonesian Rupiah (no fractional unit).
  public type Rupiah = Nat;
};
