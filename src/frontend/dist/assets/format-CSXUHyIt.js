var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _client, _currentQuery, _currentQueryInitialState, _currentResult, _currentResultState, _currentResultOptions, _currentThenable, _selectError, _selectFn, _selectResult, _lastQueryWithDefinedData, _staleTimeoutId, _refetchIntervalId, _currentRefetchInterval, _trackedProps, _QueryObserver_instances, executeFetch_fn, updateStaleTimeout_fn, computeRefetchInterval_fn, updateRefetchInterval_fn, updateTimers_fn, clearStaleTimeout_fn, clearRefetchInterval_fn, updateQuery_fn, notify_fn, _a, _client2, _currentResult2, _currentMutation, _mutateOptions, _MutationObserver_instances, updateResult_fn, notify_fn2, _b;
import { S as Subscribable, p as pendingThenable, e as resolveEnabled, s as shallowEqualObjects, f as resolveStaleTime, n as noop, g as environmentManager, i as isValidTimeout, t as timeUntilStale, h as timeoutManager, k as focusManager, l as fetchState, m as replaceData, q as notifyManager, u as hashKey, w as getDefaultState, r as reactExports, x as shouldThrowError, y as useQueryClient, z as useInternetIdentity, B as createActorWithConfig, j as jsxRuntimeExports, d as React, C as clsx, a as cn, V as Variant, T as Text, N as Null, D as Record, E as Vec, F as Nat, I as Int, O as Opt, G as Bool, H as Float64, J as Service, K as Func, M as Principal, Q as Nat8, U as HttpAgent, X as Actor } from "./index-5E34msdd.js";
var QueryObserver = (_a = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _QueryObserver_instances);
    __privateAdd(this, _client);
    __privateAdd(this, _currentQuery);
    __privateAdd(this, _currentQueryInitialState);
    __privateAdd(this, _currentResult);
    __privateAdd(this, _currentResultState);
    __privateAdd(this, _currentResultOptions);
    __privateAdd(this, _currentThenable);
    __privateAdd(this, _selectError);
    __privateAdd(this, _selectFn);
    __privateAdd(this, _selectResult);
    // This property keeps track of the last query with defined data.
    // It will be used to pass the previous data and query to the placeholder function between renders.
    __privateAdd(this, _lastQueryWithDefinedData);
    __privateAdd(this, _staleTimeoutId);
    __privateAdd(this, _refetchIntervalId);
    __privateAdd(this, _currentRefetchInterval);
    __privateAdd(this, _trackedProps, /* @__PURE__ */ new Set());
    this.options = options;
    __privateSet(this, _client, client);
    __privateSet(this, _selectError, null);
    __privateSet(this, _currentThenable, pendingThenable());
    this.bindMethods();
    this.setOptions(options);
  }
  bindMethods() {
    this.refetch = this.refetch.bind(this);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      __privateGet(this, _currentQuery).addObserver(this);
      if (shouldFetchOnMount(__privateGet(this, _currentQuery), this.options)) {
        __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
      } else {
        this.updateResult();
      }
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.destroy();
    }
  }
  shouldFetchOnReconnect() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnReconnect
    );
  }
  shouldFetchOnWindowFocus() {
    return shouldFetchOn(
      __privateGet(this, _currentQuery),
      this.options,
      this.options.refetchOnWindowFocus
    );
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
    __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
    __privateGet(this, _currentQuery).removeObserver(this);
  }
  setOptions(options) {
    const prevOptions = this.options;
    const prevQuery = __privateGet(this, _currentQuery);
    this.options = __privateGet(this, _client).defaultQueryOptions(options);
    if (this.options.enabled !== void 0 && typeof this.options.enabled !== "boolean" && typeof this.options.enabled !== "function" && typeof resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== "boolean") {
      throw new Error(
        "Expected enabled to be a boolean or a callback that returns a boolean"
      );
    }
    __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
    __privateGet(this, _currentQuery).setOptions(this.options);
    if (prevOptions._defaulted && !shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client).getQueryCache().notify({
        type: "observerOptionsUpdated",
        query: __privateGet(this, _currentQuery),
        observer: this
      });
    }
    const mounted = this.hasListeners();
    if (mounted && shouldFetchOptionally(
      __privateGet(this, _currentQuery),
      prevQuery,
      this.options,
      prevOptions
    )) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
    this.updateResult();
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || resolveStaleTime(this.options.staleTime, __privateGet(this, _currentQuery)) !== resolveStaleTime(prevOptions.staleTime, __privateGet(this, _currentQuery)))) {
      __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
    }
    const nextRefetchInterval = __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this);
    if (mounted && (__privateGet(this, _currentQuery) !== prevQuery || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) !== resolveEnabled(prevOptions.enabled, __privateGet(this, _currentQuery)) || nextRefetchInterval !== __privateGet(this, _currentRefetchInterval))) {
      __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, nextRefetchInterval);
    }
  }
  getOptimisticResult(options) {
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), options);
    const result = this.createResult(query, options);
    if (shouldAssignObserverCurrentProperties(this, result)) {
      __privateSet(this, _currentResult, result);
      __privateSet(this, _currentResultOptions, this.options);
      __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    }
    return result;
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult);
  }
  trackResult(result, onPropTracked) {
    return new Proxy(result, {
      get: (target, key) => {
        this.trackProp(key);
        onPropTracked == null ? void 0 : onPropTracked(key);
        if (key === "promise") {
          this.trackProp("data");
          if (!this.options.experimental_prefetchInRender && __privateGet(this, _currentThenable).status === "pending") {
            __privateGet(this, _currentThenable).reject(
              new Error(
                "experimental_prefetchInRender feature flag is not enabled"
              )
            );
          }
        }
        return Reflect.get(target, key);
      }
    });
  }
  trackProp(key) {
    __privateGet(this, _trackedProps).add(key);
  }
  getCurrentQuery() {
    return __privateGet(this, _currentQuery);
  }
  refetch({ ...options } = {}) {
    return this.fetch({
      ...options
    });
  }
  fetchOptimistic(options) {
    const defaultedOptions = __privateGet(this, _client).defaultQueryOptions(options);
    const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), defaultedOptions);
    return query.fetch().then(() => this.createResult(query, defaultedOptions));
  }
  fetch(fetchOptions) {
    return __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this, {
      ...fetchOptions,
      cancelRefetch: fetchOptions.cancelRefetch ?? true
    }).then(() => {
      this.updateResult();
      return __privateGet(this, _currentResult);
    });
  }
  createResult(query, options) {
    var _a2;
    const prevQuery = __privateGet(this, _currentQuery);
    const prevOptions = this.options;
    const prevResult = __privateGet(this, _currentResult);
    const prevResultState = __privateGet(this, _currentResultState);
    const prevResultOptions = __privateGet(this, _currentResultOptions);
    const queryChange = query !== prevQuery;
    const queryInitialState = queryChange ? query.state : __privateGet(this, _currentQueryInitialState);
    const { state } = query;
    let newState = { ...state };
    let isPlaceholderData = false;
    let data;
    if (options._optimisticResults) {
      const mounted = this.hasListeners();
      const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
      const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
      if (fetchOnMount || fetchOptionally) {
        newState = {
          ...newState,
          ...fetchState(state.data, query.options)
        };
      }
      if (options._optimisticResults === "isRestoring") {
        newState.fetchStatus = "idle";
      }
    }
    let { error, errorUpdatedAt, status } = newState;
    data = newState.data;
    let skipSelect = false;
    if (options.placeholderData !== void 0 && data === void 0 && status === "pending") {
      let placeholderData;
      if ((prevResult == null ? void 0 : prevResult.isPlaceholderData) && options.placeholderData === (prevResultOptions == null ? void 0 : prevResultOptions.placeholderData)) {
        placeholderData = prevResult.data;
        skipSelect = true;
      } else {
        placeholderData = typeof options.placeholderData === "function" ? options.placeholderData(
          (_a2 = __privateGet(this, _lastQueryWithDefinedData)) == null ? void 0 : _a2.state.data,
          __privateGet(this, _lastQueryWithDefinedData)
        ) : options.placeholderData;
      }
      if (placeholderData !== void 0) {
        status = "success";
        data = replaceData(
          prevResult == null ? void 0 : prevResult.data,
          placeholderData,
          options
        );
        isPlaceholderData = true;
      }
    }
    if (options.select && data !== void 0 && !skipSelect) {
      if (prevResult && data === (prevResultState == null ? void 0 : prevResultState.data) && options.select === __privateGet(this, _selectFn)) {
        data = __privateGet(this, _selectResult);
      } else {
        try {
          __privateSet(this, _selectFn, options.select);
          data = options.select(data);
          data = replaceData(prevResult == null ? void 0 : prevResult.data, data, options);
          __privateSet(this, _selectResult, data);
          __privateSet(this, _selectError, null);
        } catch (selectError) {
          __privateSet(this, _selectError, selectError);
        }
      }
    }
    if (__privateGet(this, _selectError)) {
      error = __privateGet(this, _selectError);
      data = __privateGet(this, _selectResult);
      errorUpdatedAt = Date.now();
      status = "error";
    }
    const isFetching = newState.fetchStatus === "fetching";
    const isPending = status === "pending";
    const isError = status === "error";
    const isLoading = isPending && isFetching;
    const hasData = data !== void 0;
    const result = {
      status,
      fetchStatus: newState.fetchStatus,
      isPending,
      isSuccess: status === "success",
      isError,
      isInitialLoading: isLoading,
      isLoading,
      data,
      dataUpdatedAt: newState.dataUpdatedAt,
      error,
      errorUpdatedAt,
      failureCount: newState.fetchFailureCount,
      failureReason: newState.fetchFailureReason,
      errorUpdateCount: newState.errorUpdateCount,
      isFetched: query.isFetched(),
      isFetchedAfterMount: newState.dataUpdateCount > queryInitialState.dataUpdateCount || newState.errorUpdateCount > queryInitialState.errorUpdateCount,
      isFetching,
      isRefetching: isFetching && !isPending,
      isLoadingError: isError && !hasData,
      isPaused: newState.fetchStatus === "paused",
      isPlaceholderData,
      isRefetchError: isError && hasData,
      isStale: isStale(query, options),
      refetch: this.refetch,
      promise: __privateGet(this, _currentThenable),
      isEnabled: resolveEnabled(options.enabled, query) !== false
    };
    const nextResult = result;
    if (this.options.experimental_prefetchInRender) {
      const hasResultData = nextResult.data !== void 0;
      const isErrorWithoutData = nextResult.status === "error" && !hasResultData;
      const finalizeThenableIfPossible = (thenable) => {
        if (isErrorWithoutData) {
          thenable.reject(nextResult.error);
        } else if (hasResultData) {
          thenable.resolve(nextResult.data);
        }
      };
      const recreateThenable = () => {
        const pending = __privateSet(this, _currentThenable, nextResult.promise = pendingThenable());
        finalizeThenableIfPossible(pending);
      };
      const prevThenable = __privateGet(this, _currentThenable);
      switch (prevThenable.status) {
        case "pending":
          if (query.queryHash === prevQuery.queryHash) {
            finalizeThenableIfPossible(prevThenable);
          }
          break;
        case "fulfilled":
          if (isErrorWithoutData || nextResult.data !== prevThenable.value) {
            recreateThenable();
          }
          break;
        case "rejected":
          if (!isErrorWithoutData || nextResult.error !== prevThenable.reason) {
            recreateThenable();
          }
          break;
      }
    }
    return nextResult;
  }
  updateResult() {
    const prevResult = __privateGet(this, _currentResult);
    const nextResult = this.createResult(__privateGet(this, _currentQuery), this.options);
    __privateSet(this, _currentResultState, __privateGet(this, _currentQuery).state);
    __privateSet(this, _currentResultOptions, this.options);
    if (__privateGet(this, _currentResultState).data !== void 0) {
      __privateSet(this, _lastQueryWithDefinedData, __privateGet(this, _currentQuery));
    }
    if (shallowEqualObjects(nextResult, prevResult)) {
      return;
    }
    __privateSet(this, _currentResult, nextResult);
    const shouldNotifyListeners = () => {
      if (!prevResult) {
        return true;
      }
      const { notifyOnChangeProps } = this.options;
      const notifyOnChangePropsValue = typeof notifyOnChangeProps === "function" ? notifyOnChangeProps() : notifyOnChangeProps;
      if (notifyOnChangePropsValue === "all" || !notifyOnChangePropsValue && !__privateGet(this, _trackedProps).size) {
        return true;
      }
      const includedProps = new Set(
        notifyOnChangePropsValue ?? __privateGet(this, _trackedProps)
      );
      if (this.options.throwOnError) {
        includedProps.add("error");
      }
      return Object.keys(__privateGet(this, _currentResult)).some((key) => {
        const typedKey = key;
        const changed = __privateGet(this, _currentResult)[typedKey] !== prevResult[typedKey];
        return changed && includedProps.has(typedKey);
      });
    };
    __privateMethod(this, _QueryObserver_instances, notify_fn).call(this, { listeners: shouldNotifyListeners() });
  }
  onQueryUpdate() {
    this.updateResult();
    if (this.hasListeners()) {
      __privateMethod(this, _QueryObserver_instances, updateTimers_fn).call(this);
    }
  }
}, _client = new WeakMap(), _currentQuery = new WeakMap(), _currentQueryInitialState = new WeakMap(), _currentResult = new WeakMap(), _currentResultState = new WeakMap(), _currentResultOptions = new WeakMap(), _currentThenable = new WeakMap(), _selectError = new WeakMap(), _selectFn = new WeakMap(), _selectResult = new WeakMap(), _lastQueryWithDefinedData = new WeakMap(), _staleTimeoutId = new WeakMap(), _refetchIntervalId = new WeakMap(), _currentRefetchInterval = new WeakMap(), _trackedProps = new WeakMap(), _QueryObserver_instances = new WeakSet(), executeFetch_fn = function(fetchOptions) {
  __privateMethod(this, _QueryObserver_instances, updateQuery_fn).call(this);
  let promise = __privateGet(this, _currentQuery).fetch(
    this.options,
    fetchOptions
  );
  if (!(fetchOptions == null ? void 0 : fetchOptions.throwOnError)) {
    promise = promise.catch(noop);
  }
  return promise;
}, updateStaleTimeout_fn = function() {
  __privateMethod(this, _QueryObserver_instances, clearStaleTimeout_fn).call(this);
  const staleTime = resolveStaleTime(
    this.options.staleTime,
    __privateGet(this, _currentQuery)
  );
  if (environmentManager.isServer() || __privateGet(this, _currentResult).isStale || !isValidTimeout(staleTime)) {
    return;
  }
  const time = timeUntilStale(__privateGet(this, _currentResult).dataUpdatedAt, staleTime);
  const timeout = time + 1;
  __privateSet(this, _staleTimeoutId, timeoutManager.setTimeout(() => {
    if (!__privateGet(this, _currentResult).isStale) {
      this.updateResult();
    }
  }, timeout));
}, computeRefetchInterval_fn = function() {
  return (typeof this.options.refetchInterval === "function" ? this.options.refetchInterval(__privateGet(this, _currentQuery)) : this.options.refetchInterval) ?? false;
}, updateRefetchInterval_fn = function(nextInterval) {
  __privateMethod(this, _QueryObserver_instances, clearRefetchInterval_fn).call(this);
  __privateSet(this, _currentRefetchInterval, nextInterval);
  if (environmentManager.isServer() || resolveEnabled(this.options.enabled, __privateGet(this, _currentQuery)) === false || !isValidTimeout(__privateGet(this, _currentRefetchInterval)) || __privateGet(this, _currentRefetchInterval) === 0) {
    return;
  }
  __privateSet(this, _refetchIntervalId, timeoutManager.setInterval(() => {
    if (this.options.refetchIntervalInBackground || focusManager.isFocused()) {
      __privateMethod(this, _QueryObserver_instances, executeFetch_fn).call(this);
    }
  }, __privateGet(this, _currentRefetchInterval)));
}, updateTimers_fn = function() {
  __privateMethod(this, _QueryObserver_instances, updateStaleTimeout_fn).call(this);
  __privateMethod(this, _QueryObserver_instances, updateRefetchInterval_fn).call(this, __privateMethod(this, _QueryObserver_instances, computeRefetchInterval_fn).call(this));
}, clearStaleTimeout_fn = function() {
  if (__privateGet(this, _staleTimeoutId)) {
    timeoutManager.clearTimeout(__privateGet(this, _staleTimeoutId));
    __privateSet(this, _staleTimeoutId, void 0);
  }
}, clearRefetchInterval_fn = function() {
  if (__privateGet(this, _refetchIntervalId)) {
    timeoutManager.clearInterval(__privateGet(this, _refetchIntervalId));
    __privateSet(this, _refetchIntervalId, void 0);
  }
}, updateQuery_fn = function() {
  const query = __privateGet(this, _client).getQueryCache().build(__privateGet(this, _client), this.options);
  if (query === __privateGet(this, _currentQuery)) {
    return;
  }
  const prevQuery = __privateGet(this, _currentQuery);
  __privateSet(this, _currentQuery, query);
  __privateSet(this, _currentQueryInitialState, query.state);
  if (this.hasListeners()) {
    prevQuery == null ? void 0 : prevQuery.removeObserver(this);
    query.addObserver(this);
  }
}, notify_fn = function(notifyOptions) {
  notifyManager.batch(() => {
    if (notifyOptions.listeners) {
      this.listeners.forEach((listener) => {
        listener(__privateGet(this, _currentResult));
      });
    }
    __privateGet(this, _client).getQueryCache().notify({
      query: __privateGet(this, _currentQuery),
      type: "observerResultsUpdated"
    });
  });
}, _a);
function shouldLoadOnMount(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.state.data === void 0 && !(query.state.status === "error" && options.retryOnMount === false);
}
function shouldFetchOnMount(query, options) {
  return shouldLoadOnMount(query, options) || query.state.data !== void 0 && shouldFetchOn(query, options, options.refetchOnMount);
}
function shouldFetchOn(query, options, field) {
  if (resolveEnabled(options.enabled, query) !== false && resolveStaleTime(options.staleTime, query) !== "static") {
    const value = typeof field === "function" ? field(query) : field;
    return value === "always" || value !== false && isStale(query, options);
  }
  return false;
}
function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
  return (query !== prevQuery || resolveEnabled(prevOptions.enabled, query) === false) && (!options.suspense || query.state.status !== "error") && isStale(query, options);
}
function isStale(query, options) {
  return resolveEnabled(options.enabled, query) !== false && query.isStaleByTime(resolveStaleTime(options.staleTime, query));
}
function shouldAssignObserverCurrentProperties(observer, optimisticResult) {
  if (!shallowEqualObjects(observer.getCurrentResult(), optimisticResult)) {
    return true;
  }
  return false;
}
var MutationObserver = (_b = class extends Subscribable {
  constructor(client, options) {
    super();
    __privateAdd(this, _MutationObserver_instances);
    __privateAdd(this, _client2);
    __privateAdd(this, _currentResult2);
    __privateAdd(this, _currentMutation);
    __privateAdd(this, _mutateOptions);
    __privateSet(this, _client2, client);
    this.setOptions(options);
    this.bindMethods();
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
  }
  bindMethods() {
    this.mutate = this.mutate.bind(this);
    this.reset = this.reset.bind(this);
  }
  setOptions(options) {
    var _a2;
    const prevOptions = this.options;
    this.options = __privateGet(this, _client2).defaultMutationOptions(options);
    if (!shallowEqualObjects(this.options, prevOptions)) {
      __privateGet(this, _client2).getMutationCache().notify({
        type: "observerOptionsUpdated",
        mutation: __privateGet(this, _currentMutation),
        observer: this
      });
    }
    if ((prevOptions == null ? void 0 : prevOptions.mutationKey) && this.options.mutationKey && hashKey(prevOptions.mutationKey) !== hashKey(this.options.mutationKey)) {
      this.reset();
    } else if (((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state.status) === "pending") {
      __privateGet(this, _currentMutation).setOptions(this.options);
    }
  }
  onUnsubscribe() {
    var _a2;
    if (!this.hasListeners()) {
      (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    }
  }
  onMutationUpdate(action) {
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this, action);
  }
  getCurrentResult() {
    return __privateGet(this, _currentResult2);
  }
  reset() {
    var _a2;
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, void 0);
    __privateMethod(this, _MutationObserver_instances, updateResult_fn).call(this);
    __privateMethod(this, _MutationObserver_instances, notify_fn2).call(this);
  }
  mutate(variables, options) {
    var _a2;
    __privateSet(this, _mutateOptions, options);
    (_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.removeObserver(this);
    __privateSet(this, _currentMutation, __privateGet(this, _client2).getMutationCache().build(__privateGet(this, _client2), this.options));
    __privateGet(this, _currentMutation).addObserver(this);
    return __privateGet(this, _currentMutation).execute(variables);
  }
}, _client2 = new WeakMap(), _currentResult2 = new WeakMap(), _currentMutation = new WeakMap(), _mutateOptions = new WeakMap(), _MutationObserver_instances = new WeakSet(), updateResult_fn = function() {
  var _a2;
  const state = ((_a2 = __privateGet(this, _currentMutation)) == null ? void 0 : _a2.state) ?? getDefaultState();
  __privateSet(this, _currentResult2, {
    ...state,
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
    isIdle: state.status === "idle",
    mutate: this.mutate,
    reset: this.reset
  });
}, notify_fn2 = function(action) {
  notifyManager.batch(() => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    if (__privateGet(this, _mutateOptions) && this.hasListeners()) {
      const variables = __privateGet(this, _currentResult2).variables;
      const onMutateResult = __privateGet(this, _currentResult2).context;
      const context = {
        client: __privateGet(this, _client2),
        meta: this.options.meta,
        mutationKey: this.options.mutationKey
      };
      if ((action == null ? void 0 : action.type) === "success") {
        try {
          (_b2 = (_a2 = __privateGet(this, _mutateOptions)).onSuccess) == null ? void 0 : _b2.call(
            _a2,
            action.data,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_d = (_c = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _d.call(
            _c,
            action.data,
            null,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      } else if ((action == null ? void 0 : action.type) === "error") {
        try {
          (_f = (_e = __privateGet(this, _mutateOptions)).onError) == null ? void 0 : _f.call(
            _e,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
        try {
          (_h = (_g = __privateGet(this, _mutateOptions)).onSettled) == null ? void 0 : _h.call(
            _g,
            void 0,
            action.error,
            variables,
            onMutateResult,
            context
          );
        } catch (e) {
          void Promise.reject(e);
        }
      }
    }
    this.listeners.forEach((listener) => {
      listener(__privateGet(this, _currentResult2));
    });
  });
}, _b);
var IsRestoringContext = reactExports.createContext(false);
var useIsRestoring = () => reactExports.useContext(IsRestoringContext);
IsRestoringContext.Provider;
function createValue() {
  let isReset = false;
  return {
    clearReset: () => {
      isReset = false;
    },
    reset: () => {
      isReset = true;
    },
    isReset: () => {
      return isReset;
    }
  };
}
var QueryErrorResetBoundaryContext = reactExports.createContext(createValue());
var useQueryErrorResetBoundary = () => reactExports.useContext(QueryErrorResetBoundaryContext);
var ensurePreventErrorBoundaryRetry = (options, errorResetBoundary, query) => {
  const throwOnError = (query == null ? void 0 : query.state.error) && typeof options.throwOnError === "function" ? shouldThrowError(options.throwOnError, [query.state.error, query]) : options.throwOnError;
  if (options.suspense || options.experimental_prefetchInRender || throwOnError) {
    if (!errorResetBoundary.isReset()) {
      options.retryOnMount = false;
    }
  }
};
var useClearResetErrorBoundary = (errorResetBoundary) => {
  reactExports.useEffect(() => {
    errorResetBoundary.clearReset();
  }, [errorResetBoundary]);
};
var getHasError = ({
  result,
  errorResetBoundary,
  throwOnError,
  query,
  suspense
}) => {
  return result.isError && !errorResetBoundary.isReset() && !result.isFetching && query && (suspense && result.data === void 0 || shouldThrowError(throwOnError, [result.error, query]));
};
var ensureSuspenseTimers = (defaultedOptions) => {
  if (defaultedOptions.suspense) {
    const MIN_SUSPENSE_TIME_MS = 1e3;
    const clamp = (value) => value === "static" ? value : Math.max(value ?? MIN_SUSPENSE_TIME_MS, MIN_SUSPENSE_TIME_MS);
    const originalStaleTime = defaultedOptions.staleTime;
    defaultedOptions.staleTime = typeof originalStaleTime === "function" ? (...args) => clamp(originalStaleTime(...args)) : clamp(originalStaleTime);
    if (typeof defaultedOptions.gcTime === "number") {
      defaultedOptions.gcTime = Math.max(
        defaultedOptions.gcTime,
        MIN_SUSPENSE_TIME_MS
      );
    }
  }
};
var willFetch = (result, isRestoring) => result.isLoading && result.isFetching && !isRestoring;
var shouldSuspend = (defaultedOptions, result) => (defaultedOptions == null ? void 0 : defaultedOptions.suspense) && result.isPending;
var fetchOptimistic = (defaultedOptions, observer, errorResetBoundary) => observer.fetchOptimistic(defaultedOptions).catch(() => {
  errorResetBoundary.clearReset();
});
function useBaseQuery(options, Observer, queryClient) {
  var _a2, _b2, _c, _d;
  const isRestoring = useIsRestoring();
  const errorResetBoundary = useQueryErrorResetBoundary();
  const client = useQueryClient();
  const defaultedOptions = client.defaultQueryOptions(options);
  (_b2 = (_a2 = client.getDefaultOptions().queries) == null ? void 0 : _a2._experimental_beforeQuery) == null ? void 0 : _b2.call(
    _a2,
    defaultedOptions
  );
  const query = client.getQueryCache().get(defaultedOptions.queryHash);
  defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
  ensureSuspenseTimers(defaultedOptions);
  ensurePreventErrorBoundaryRetry(defaultedOptions, errorResetBoundary, query);
  useClearResetErrorBoundary(errorResetBoundary);
  const isNewCacheEntry = !client.getQueryCache().get(defaultedOptions.queryHash);
  const [observer] = reactExports.useState(
    () => new Observer(
      client,
      defaultedOptions
    )
  );
  const result = observer.getOptimisticResult(defaultedOptions);
  const shouldSubscribe = !isRestoring && options.subscribed !== false;
  reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => {
        const unsubscribe = shouldSubscribe ? observer.subscribe(notifyManager.batchCalls(onStoreChange)) : noop;
        observer.updateResult();
        return unsubscribe;
      },
      [observer, shouldSubscribe]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  reactExports.useEffect(() => {
    observer.setOptions(defaultedOptions);
  }, [defaultedOptions, observer]);
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary);
  }
  if (getHasError({
    result,
    errorResetBoundary,
    throwOnError: defaultedOptions.throwOnError,
    query,
    suspense: defaultedOptions.suspense
  })) {
    throw result.error;
  }
  (_d = (_c = client.getDefaultOptions().queries) == null ? void 0 : _c._experimental_afterQuery) == null ? void 0 : _d.call(
    _c,
    defaultedOptions,
    result
  );
  if (defaultedOptions.experimental_prefetchInRender && !environmentManager.isServer() && willFetch(result, isRestoring)) {
    const promise = isNewCacheEntry ? (
      // Fetch immediately on render in order to ensure `.promise` is resolved even if the component is unmounted
      fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
    ) : (
      // subscribe to the "cache promise" so that we can finalize the currentThenable once data comes in
      query == null ? void 0 : query.promise
    );
    promise == null ? void 0 : promise.catch(noop).finally(() => {
      observer.updateResult();
    });
  }
  return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
function useQuery(options, queryClient) {
  return useBaseQuery(options, QueryObserver);
}
function useMutation(options, queryClient) {
  const client = useQueryClient();
  const [observer] = reactExports.useState(
    () => new MutationObserver(
      client,
      options
    )
  );
  reactExports.useEffect(() => {
    observer.setOptions(options);
  }, [observer, options]);
  const result = reactExports.useSyncExternalStore(
    reactExports.useCallback(
      (onStoreChange) => observer.subscribe(notifyManager.batchCalls(onStoreChange)),
      [observer]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  const mutate = reactExports.useCallback(
    (variables, mutateOptions) => {
      observer.mutate(variables, mutateOptions).catch(noop);
    },
    [observer]
  );
  if (result.error && shouldThrowError(observer.options.throwOnError, [result.error])) {
    throw result.error;
  }
  return { ...result, mutate, mutateAsync: result.mutate };
}
const ACTOR_QUERY_KEY = "actor";
function useActor(createActor2, options) {
  const { identity, isAuthenticated } = useInternetIdentity();
  const queryClient = useQueryClient();
  const mockModules = options == null ? void 0 : options.mockModules;
  const actorQuery = useQuery({
    queryKey: [ACTOR_QUERY_KEY, identity == null ? void 0 : identity.getPrincipal().toString()],
    queryFn: async () => {
      if (!isAuthenticated) {
        return await createActorWithConfig(createActor2, { mockModules });
      }
      const actor = await createActorWithConfig(createActor2, {
        agentOptions: { identity },
        mockModules
      });
      return actor;
    },
    // Only refetch when identity changes
    staleTime: Number.POSITIVE_INFINITY,
    // This will cause the actor to be recreated when the identity changes
    enabled: true
  });
  reactExports.useEffect(() => {
    if (actorQuery.data) {
      queryClient.invalidateQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
      queryClient.refetchQueries({
        predicate: (query) => {
          return !query.queryKey.includes(ACTOR_QUERY_KEY);
        }
      });
    }
  }, [actorQuery.data, queryClient]);
  return {
    actor: actorQuery.data || null,
    isFetching: actorQuery.isFetching
  };
}
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
var use = React[" use ".trim().toString()];
function isPromiseLike(value) {
  return typeof value === "object" && value !== null && "then" in value;
}
function isLazyComponent(element) {
  return element != null && typeof element === "object" && "$$typeof" in element && element.$$typeof === REACT_LAZY_TYPE && "_payload" in element && isPromiseLike(element._payload);
}
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    const childrenArray = reactExports.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (reactExports.Children.count(newElement) > 1) return reactExports.Children.only(null);
          return reactExports.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: reactExports.isValidElement(newElement) ? reactExports.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
var Slot = /* @__PURE__ */ createSlot("Slot");
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = reactExports.forwardRef((props, forwardedRef) => {
    let { children, ...slotProps } = props;
    if (isLazyComponent(children) && typeof use === "function") {
      children = use(children._payload);
    }
    if (reactExports.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== reactExports.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return reactExports.cloneElement(children, props2);
    }
    return reactExports.Children.count(children) > 1 ? reactExports.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
function isSlottable(child) {
  return reactExports.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  var _a2, _b2;
  let getter = (_a2 = Object.getOwnPropertyDescriptor(element.props, "ref")) == null ? void 0 : _a2.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = (_b2 = Object.getOwnPropertyDescriptor(element, "ref")) == null ? void 0 : _b2.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
const falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
const cx = clsx;
const cva = (base, config) => (props) => {
  var _config_compoundVariants;
  if ((config === null || config === void 0 ? void 0 : config.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
  const { variants, defaultVariants } = config;
  const getVariantClassNames = Object.keys(variants).map((variant) => {
    const variantProp = props === null || props === void 0 ? void 0 : props[variant];
    const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
    if (variantProp === null) return null;
    const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
    return variants[variant][variantKey];
  });
  const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
    let [key, value] = param;
    if (value === void 0) {
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
  const getCompoundVariantClassNames = config === null || config === void 0 ? void 0 : (_config_compoundVariants = config.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
    let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
    return Object.entries(compoundVariantOptions).every((param2) => {
      let [key, value] = param2;
      return Array.isArray(value) ? value.includes({
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key]) : {
        ...defaultVariants,
        ...propsWithoutUndefined
      }[key] === value;
    }) ? [
      ...acc,
      cvClass,
      cvClassName
    ] : acc;
  }, []);
  return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
};
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
const Error$1 = Variant({
  "FrontendOriginsNotConfigured": Null,
  "MixedSsoSources": Record({
    "otherKeys": Vec(Text),
    "ssoKeys": Vec(Text)
  }),
  "Stale": Record({ "ageNs": Nat }),
  "MalformedCandid": Null,
  "AmbiguousAttribute": Record({
    "field": Text,
    "sources": Vec(Text)
  }),
  "NoAttributes": Null,
  "UnknownNonce": Null,
  "UntrustedSsoSource": Record({ "domain": Text }),
  "MissingField": Text,
  "FrontendOriginMismatch": Record({
    "got": Text,
    "expected": Vec(Text)
  })
});
const Result_4 = Variant({ "ok": Null, "err": Error$1 });
const UserRole = Variant({
  "admin": Null,
  "user": Null,
  "guest": Null
});
const EntryType$1 = Variant({
  "masuk": Null,
  "keluar": Null
});
const Rupiah = Nat;
const NewCashflowEntry = Record({
  "entryType": EntryType$1,
  "note": Text,
  "amount": Rupiah
});
const Id = Nat;
const EntrySource = Variant({
  "transaksi": Null,
  "restock": Null,
  "manual": Null
});
const Timestamp = Int;
const CashflowEntry = Record({
  "id": Id,
  "entryType": EntryType$1,
  "source": EntrySource,
  "date": Timestamp,
  "note": Text,
  "amount": Rupiah
});
const CashflowError = Variant({ "invalidAmount": Null });
const Result_3 = Variant({
  "ok": CashflowEntry,
  "err": CashflowError
});
const NewProduct = Record({
  "cost": Opt(Rupiah),
  "name": Text,
  "stock": Opt(Nat),
  "price": Opt(Rupiah)
});
const ProductError = Variant({
  "emptyName": Null,
  "notFound": Id
});
const Result_2 = Variant({ "ok": Id, "err": ProductError });
const NewRestock = Record({
  "qty": Nat,
  "supplier": Text,
  "cost": Rupiah,
  "productId": Id
});
const Restock = Record({
  "id": Id,
  "qty": Nat,
  "supplier": Text,
  "cost": Rupiah,
  "date": Timestamp,
  "productId": Id,
  "productName": Text
});
const RestockError = Variant({
  "productNotFound": Id,
  "invalidQty": Null
});
const Result_1 = Variant({ "ok": Restock, "err": RestockError });
const Status$1 = Variant({
  "baru": Null,
  "selesai": Null,
  "proses": Null,
  "kirim": Null
});
const NewTransaction = Record({
  "qty": Nat,
  "status": Status$1,
  "productId": Id,
  "orderNo": Text
});
const Transaction = Record({
  "id": Id,
  "qty": Nat,
  "status": Status$1,
  "total": Rupiah,
  "date": Timestamp,
  "productId": Id,
  "productName": Text,
  "orderNo": Text
});
const TransactionError = Variant({
  "productNotFound": Id,
  "invalidQty": Null,
  "notFound": Id,
  "insufficientStock": Record({
    "requested": Nat,
    "available": Nat
  })
});
const Result = Variant({
  "ok": Transaction,
  "err": TransactionError
});
const Value = Variant({
  "int": Int,
  "nat": Nat,
  "float": Float64,
  "bool": Bool,
  "null": Null,
  "text": Text
});
const Cell = Record({ "value": Value, "name": Text });
const Result__1 = Record({
  "hasMore": Bool,
  "rows": Vec(Vec(Cell))
});
const DashboardSummary = Record({
  "omzet": Rupiah,
  "saldoKas": Int,
  "produkStokMenipis": Nat,
  "labaKotor": Int
});
const ProductView = Record({
  "id": Id,
  "cost": Rupiah,
  "name": Text,
  "sold": Nat,
  "stock": Nat,
  "price": Rupiah
});
const DashboardData = Record({
  "recentTransactions": Vec(Transaction),
  "summary": DashboardSummary,
  "lowStockProducts": Vec(ProductView)
});
const ImportSkipReason = Variant({
  "emptyLine": Null,
  "invalidRow": Null,
  "invalidNumber": Text,
  "invalidDate": Text
});
const ImportSkip = Record({
  "line": Nat,
  "reason": ImportSkipReason
});
const ImportSummary = Record({
  "skipped": Nat,
  "details": Vec(ImportSkip),
  "succeeded": Nat
});
const CashflowRow = Record({
  "id": Id,
  "entryType": EntryType$1,
  "balance": Int,
  "source": EntrySource,
  "date": Timestamp,
  "note": Text,
  "amount": Rupiah
});
Service({
  "_initialize_access_control": Func([], [], []),
  "_internet_identity_sign_in_finish": Func([], [Result_4], []),
  "_internet_identity_sign_in_start": Func([], [Vec(Nat8)], []),
  "assignCallerUserRole": Func([Principal, UserRole], [], []),
  "createCashflowEntry": Func([NewCashflowEntry], [Result_3], []),
  "createProduct": Func([NewProduct], [Result_2], []),
  "createRestock": Func([NewRestock], [Result_1], []),
  "createTransaction": Func([NewTransaction], [Result], []),
  "deleteProduct": Func([Id], [Bool], []),
  "execute": Func([Text], [Result__1], ["query"]),
  "getApiDoc": Func([], [Text], ["query"]),
  "getCallerUserRole": Func([], [UserRole], ["query"]),
  "getCashBalance": Func([], [Int], ["query"]),
  "getDashboard": Func([], [DashboardData], ["query"]),
  "importTransactions": Func([Text], [ImportSummary], []),
  "isCallerAdmin": Func([], [Bool], ["query"]),
  "listCashflow": Func([], [Vec(CashflowRow)], ["query"]),
  "listProducts": Func([], [Vec(ProductView)], ["query"]),
  "listRestocks": Func([], [Vec(Restock)], ["query"]),
  "listTransactions": Func([], [Vec(Transaction)], ["query"]),
  "schema": Func([], [Text], ["query"]),
  "updateTransactionStatus": Func([Id, Status$1], [Result], [])
});
const idlFactory = ({ IDL }) => {
  const Error2 = IDL.Variant({
    "FrontendOriginsNotConfigured": IDL.Null,
    "MixedSsoSources": IDL.Record({
      "otherKeys": IDL.Vec(IDL.Text),
      "ssoKeys": IDL.Vec(IDL.Text)
    }),
    "Stale": IDL.Record({ "ageNs": IDL.Nat }),
    "MalformedCandid": IDL.Null,
    "AmbiguousAttribute": IDL.Record({
      "field": IDL.Text,
      "sources": IDL.Vec(IDL.Text)
    }),
    "NoAttributes": IDL.Null,
    "UnknownNonce": IDL.Null,
    "UntrustedSsoSource": IDL.Record({ "domain": IDL.Text }),
    "MissingField": IDL.Text,
    "FrontendOriginMismatch": IDL.Record({
      "got": IDL.Text,
      "expected": IDL.Vec(IDL.Text)
    })
  });
  const Result_42 = IDL.Variant({ "ok": IDL.Null, "err": Error2 });
  const UserRole2 = IDL.Variant({
    "admin": IDL.Null,
    "user": IDL.Null,
    "guest": IDL.Null
  });
  const EntryType2 = IDL.Variant({ "masuk": IDL.Null, "keluar": IDL.Null });
  const Rupiah2 = IDL.Nat;
  const NewCashflowEntry2 = IDL.Record({
    "entryType": EntryType2,
    "note": IDL.Text,
    "amount": Rupiah2
  });
  const Id2 = IDL.Nat;
  const EntrySource2 = IDL.Variant({
    "transaksi": IDL.Null,
    "restock": IDL.Null,
    "manual": IDL.Null
  });
  const Timestamp2 = IDL.Int;
  const CashflowEntry2 = IDL.Record({
    "id": Id2,
    "entryType": EntryType2,
    "source": EntrySource2,
    "date": Timestamp2,
    "note": IDL.Text,
    "amount": Rupiah2
  });
  const CashflowError2 = IDL.Variant({ "invalidAmount": IDL.Null });
  const Result_32 = IDL.Variant({ "ok": CashflowEntry2, "err": CashflowError2 });
  const NewProduct2 = IDL.Record({
    "cost": IDL.Opt(Rupiah2),
    "name": IDL.Text,
    "stock": IDL.Opt(IDL.Nat),
    "price": IDL.Opt(Rupiah2)
  });
  const ProductError2 = IDL.Variant({ "emptyName": IDL.Null, "notFound": Id2 });
  const Result_22 = IDL.Variant({ "ok": Id2, "err": ProductError2 });
  const NewRestock2 = IDL.Record({
    "qty": IDL.Nat,
    "supplier": IDL.Text,
    "cost": Rupiah2,
    "productId": Id2
  });
  const Restock2 = IDL.Record({
    "id": Id2,
    "qty": IDL.Nat,
    "supplier": IDL.Text,
    "cost": Rupiah2,
    "date": Timestamp2,
    "productId": Id2,
    "productName": IDL.Text
  });
  const RestockError2 = IDL.Variant({
    "productNotFound": Id2,
    "invalidQty": IDL.Null
  });
  const Result_12 = IDL.Variant({ "ok": Restock2, "err": RestockError2 });
  const Status2 = IDL.Variant({
    "baru": IDL.Null,
    "selesai": IDL.Null,
    "proses": IDL.Null,
    "kirim": IDL.Null
  });
  const NewTransaction2 = IDL.Record({
    "qty": IDL.Nat,
    "status": Status2,
    "productId": Id2,
    "orderNo": IDL.Text
  });
  const Transaction2 = IDL.Record({
    "id": Id2,
    "qty": IDL.Nat,
    "status": Status2,
    "total": Rupiah2,
    "date": Timestamp2,
    "productId": Id2,
    "productName": IDL.Text,
    "orderNo": IDL.Text
  });
  const TransactionError2 = IDL.Variant({
    "productNotFound": Id2,
    "invalidQty": IDL.Null,
    "notFound": Id2,
    "insufficientStock": IDL.Record({
      "requested": IDL.Nat,
      "available": IDL.Nat
    })
  });
  const Result2 = IDL.Variant({ "ok": Transaction2, "err": TransactionError2 });
  const Value2 = IDL.Variant({
    "int": IDL.Int,
    "nat": IDL.Nat,
    "float": IDL.Float64,
    "bool": IDL.Bool,
    "null": IDL.Null,
    "text": IDL.Text
  });
  const Cell2 = IDL.Record({ "value": Value2, "name": IDL.Text });
  const Result__12 = IDL.Record({
    "hasMore": IDL.Bool,
    "rows": IDL.Vec(IDL.Vec(Cell2))
  });
  const DashboardSummary2 = IDL.Record({
    "omzet": Rupiah2,
    "saldoKas": IDL.Int,
    "produkStokMenipis": IDL.Nat,
    "labaKotor": IDL.Int
  });
  const ProductView2 = IDL.Record({
    "id": Id2,
    "cost": Rupiah2,
    "name": IDL.Text,
    "sold": IDL.Nat,
    "stock": IDL.Nat,
    "price": Rupiah2
  });
  const DashboardData2 = IDL.Record({
    "recentTransactions": IDL.Vec(Transaction2),
    "summary": DashboardSummary2,
    "lowStockProducts": IDL.Vec(ProductView2)
  });
  const ImportSkipReason2 = IDL.Variant({
    "emptyLine": IDL.Null,
    "invalidRow": IDL.Null,
    "invalidNumber": IDL.Text,
    "invalidDate": IDL.Text
  });
  const ImportSkip2 = IDL.Record({
    "line": IDL.Nat,
    "reason": ImportSkipReason2
  });
  const ImportSummary2 = IDL.Record({
    "skipped": IDL.Nat,
    "details": IDL.Vec(ImportSkip2),
    "succeeded": IDL.Nat
  });
  const CashflowRow2 = IDL.Record({
    "id": Id2,
    "entryType": EntryType2,
    "balance": IDL.Int,
    "source": EntrySource2,
    "date": Timestamp2,
    "note": IDL.Text,
    "amount": Rupiah2
  });
  return IDL.Service({
    "_initialize_access_control": IDL.Func([], [], []),
    "_internet_identity_sign_in_finish": IDL.Func([], [Result_42], []),
    "_internet_identity_sign_in_start": IDL.Func([], [IDL.Vec(IDL.Nat8)], []),
    "assignCallerUserRole": IDL.Func([IDL.Principal, UserRole2], [], []),
    "createCashflowEntry": IDL.Func([NewCashflowEntry2], [Result_32], []),
    "createProduct": IDL.Func([NewProduct2], [Result_22], []),
    "createRestock": IDL.Func([NewRestock2], [Result_12], []),
    "createTransaction": IDL.Func([NewTransaction2], [Result2], []),
    "deleteProduct": IDL.Func([Id2], [IDL.Bool], []),
    "execute": IDL.Func([IDL.Text], [Result__12], ["query"]),
    "getApiDoc": IDL.Func([], [IDL.Text], ["query"]),
    "getCallerUserRole": IDL.Func([], [UserRole2], ["query"]),
    "getCashBalance": IDL.Func([], [IDL.Int], ["query"]),
    "getDashboard": IDL.Func([], [DashboardData2], ["query"]),
    "importTransactions": IDL.Func([IDL.Text], [ImportSummary2], []),
    "isCallerAdmin": IDL.Func([], [IDL.Bool], ["query"]),
    "listCashflow": IDL.Func([], [IDL.Vec(CashflowRow2)], ["query"]),
    "listProducts": IDL.Func([], [IDL.Vec(ProductView2)], ["query"]),
    "listRestocks": IDL.Func([], [IDL.Vec(Restock2)], ["query"]),
    "listTransactions": IDL.Func([], [IDL.Vec(Transaction2)], ["query"]),
    "schema": IDL.Func([], [IDL.Text], ["query"]),
    "updateTransactionStatus": IDL.Func([Id2, Status2], [Result2], [])
  });
};
function candid_some(value) {
  return [
    value
  ];
}
function candid_none() {
  return [];
}
var EntryType = /* @__PURE__ */ ((EntryType2) => {
  EntryType2["masuk"] = "masuk";
  EntryType2["keluar"] = "keluar";
  return EntryType2;
})(EntryType || {});
var Status = /* @__PURE__ */ ((Status2) => {
  Status2["baru"] = "baru";
  Status2["selesai"] = "selesai";
  Status2["proses"] = "proses";
  Status2["kirim"] = "kirim";
  return Status2;
})(Status || {});
class Backend {
  constructor(actor, _uploadFile, _downloadFile, processError) {
    this.actor = actor;
    this._uploadFile = _uploadFile;
    this._downloadFile = _downloadFile;
    this.processError = processError;
  }
  async _initialize_access_control() {
    if (this.processError) {
      try {
        const result = await this.actor._initialize_access_control();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._initialize_access_control();
      return result;
    }
  }
  async _internet_identity_sign_in_finish() {
    if (this.processError) {
      try {
        const result = await this.actor._internet_identity_sign_in_finish();
        return from_candid_Result_4_n1(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._internet_identity_sign_in_finish();
      return from_candid_Result_4_n1(this._uploadFile, this._downloadFile, result);
    }
  }
  async _internet_identity_sign_in_start() {
    if (this.processError) {
      try {
        const result = await this.actor._internet_identity_sign_in_start();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor._internet_identity_sign_in_start();
      return result;
    }
  }
  async assignCallerUserRole(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n5(this._uploadFile, this._downloadFile, arg1));
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n5(this._uploadFile, this._downloadFile, arg1));
      return result;
    }
  }
  async createCashflowEntry(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createCashflowEntry(to_candid_NewCashflowEntry_n6(this._uploadFile, this._downloadFile, arg0));
        return from_candid_Result_3_n9(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createCashflowEntry(to_candid_NewCashflowEntry_n6(this._uploadFile, this._downloadFile, arg0));
      return from_candid_Result_3_n9(this._uploadFile, this._downloadFile, result);
    }
  }
  async createProduct(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createProduct(to_candid_NewProduct_n16(this._uploadFile, this._downloadFile, arg0));
        return from_candid_Result_2_n18(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createProduct(to_candid_NewProduct_n16(this._uploadFile, this._downloadFile, arg0));
      return from_candid_Result_2_n18(this._uploadFile, this._downloadFile, result);
    }
  }
  async createRestock(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createRestock(arg0);
        return from_candid_Result_1_n22(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createRestock(arg0);
      return from_candid_Result_1_n22(this._uploadFile, this._downloadFile, result);
    }
  }
  async createTransaction(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.createTransaction(to_candid_NewTransaction_n26(this._uploadFile, this._downloadFile, arg0));
        return from_candid_Result_n29(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.createTransaction(to_candid_NewTransaction_n26(this._uploadFile, this._downloadFile, arg0));
      return from_candid_Result_n29(this._uploadFile, this._downloadFile, result);
    }
  }
  async deleteProduct(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.deleteProduct(arg0);
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.deleteProduct(arg0);
      return result;
    }
  }
  async execute(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.execute(arg0);
        return from_candid_Result__1_n36(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.execute(arg0);
      return from_candid_Result__1_n36(this._uploadFile, this._downloadFile, result);
    }
  }
  async getApiDoc() {
    if (this.processError) {
      try {
        const result = await this.actor.getApiDoc();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getApiDoc();
      return result;
    }
  }
  async getCallerUserRole() {
    if (this.processError) {
      try {
        const result = await this.actor.getCallerUserRole();
        return from_candid_UserRole_n44(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCallerUserRole();
      return from_candid_UserRole_n44(this._uploadFile, this._downloadFile, result);
    }
  }
  async getCashBalance() {
    if (this.processError) {
      try {
        const result = await this.actor.getCashBalance();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getCashBalance();
      return result;
    }
  }
  async getDashboard() {
    if (this.processError) {
      try {
        const result = await this.actor.getDashboard();
        return from_candid_DashboardData_n45(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.getDashboard();
      return from_candid_DashboardData_n45(this._uploadFile, this._downloadFile, result);
    }
  }
  async importTransactions(arg0) {
    if (this.processError) {
      try {
        const result = await this.actor.importTransactions(arg0);
        return from_candid_ImportSummary_n48(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.importTransactions(arg0);
      return from_candid_ImportSummary_n48(this._uploadFile, this._downloadFile, result);
    }
  }
  async isCallerAdmin() {
    if (this.processError) {
      try {
        const result = await this.actor.isCallerAdmin();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.isCallerAdmin();
      return result;
    }
  }
  async listCashflow() {
    if (this.processError) {
      try {
        const result = await this.actor.listCashflow();
        return from_candid_vec_n55(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listCashflow();
      return from_candid_vec_n55(this._uploadFile, this._downloadFile, result);
    }
  }
  async listProducts() {
    if (this.processError) {
      try {
        const result = await this.actor.listProducts();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listProducts();
      return result;
    }
  }
  async listRestocks() {
    if (this.processError) {
      try {
        const result = await this.actor.listRestocks();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listRestocks();
      return result;
    }
  }
  async listTransactions() {
    if (this.processError) {
      try {
        const result = await this.actor.listTransactions();
        return from_candid_vec_n47(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.listTransactions();
      return from_candid_vec_n47(this._uploadFile, this._downloadFile, result);
    }
  }
  async schema() {
    if (this.processError) {
      try {
        const result = await this.actor.schema();
        return result;
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.schema();
      return result;
    }
  }
  async updateTransactionStatus(arg0, arg1) {
    if (this.processError) {
      try {
        const result = await this.actor.updateTransactionStatus(arg0, to_candid_Status_n28(this._uploadFile, this._downloadFile, arg1));
        return from_candid_Result_n29(this._uploadFile, this._downloadFile, result);
      } catch (e) {
        this.processError(e);
        throw new Error("unreachable");
      }
    } else {
      const result = await this.actor.updateTransactionStatus(arg0, to_candid_Status_n28(this._uploadFile, this._downloadFile, arg1));
      return from_candid_Result_n29(this._uploadFile, this._downloadFile, result);
    }
  }
}
function from_candid_CashflowEntry_n11(_uploadFile, _downloadFile, value) {
  return from_candid_record_n12(_uploadFile, _downloadFile, value);
}
function from_candid_CashflowError_n15(_uploadFile, _downloadFile, value) {
  return "invalidAmount" in value ? "invalidAmount" : value;
}
function from_candid_CashflowRow_n56(_uploadFile, _downloadFile, value) {
  return from_candid_record_n57(_uploadFile, _downloadFile, value);
}
function from_candid_Cell_n40(_uploadFile, _downloadFile, value) {
  return from_candid_record_n41(_uploadFile, _downloadFile, value);
}
function from_candid_DashboardData_n45(_uploadFile, _downloadFile, value) {
  return from_candid_record_n46(_uploadFile, _downloadFile, value);
}
function from_candid_EntrySource_n14(_uploadFile, _downloadFile, value) {
  return "transaksi" in value ? "transaksi" : "restock" in value ? "restock" : "manual" in value ? "manual" : value;
}
function from_candid_EntryType_n13(_uploadFile, _downloadFile, value) {
  return "masuk" in value ? "masuk" : "keluar" in value ? "keluar" : value;
}
function from_candid_Error_n3(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n4(_uploadFile, _downloadFile, value);
}
function from_candid_ImportSkipReason_n53(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n54(_uploadFile, _downloadFile, value);
}
function from_candid_ImportSkip_n51(_uploadFile, _downloadFile, value) {
  return from_candid_record_n52(_uploadFile, _downloadFile, value);
}
function from_candid_ImportSummary_n48(_uploadFile, _downloadFile, value) {
  return from_candid_record_n49(_uploadFile, _downloadFile, value);
}
function from_candid_ProductError_n20(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n21(_uploadFile, _downloadFile, value);
}
function from_candid_RestockError_n24(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n25(_uploadFile, _downloadFile, value);
}
function from_candid_Result_1_n22(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n23(_uploadFile, _downloadFile, value);
}
function from_candid_Result_2_n18(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n19(_uploadFile, _downloadFile, value);
}
function from_candid_Result_3_n9(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n10(_uploadFile, _downloadFile, value);
}
function from_candid_Result_4_n1(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n2(_uploadFile, _downloadFile, value);
}
function from_candid_Result__1_n36(_uploadFile, _downloadFile, value) {
  return from_candid_record_n37(_uploadFile, _downloadFile, value);
}
function from_candid_Result_n29(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n30(_uploadFile, _downloadFile, value);
}
function from_candid_Status_n33(_uploadFile, _downloadFile, value) {
  return "baru" in value ? "baru" : "selesai" in value ? "selesai" : "proses" in value ? "proses" : "kirim" in value ? "kirim" : value;
}
function from_candid_TransactionError_n34(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n35(_uploadFile, _downloadFile, value);
}
function from_candid_Transaction_n31(_uploadFile, _downloadFile, value) {
  return from_candid_record_n32(_uploadFile, _downloadFile, value);
}
function from_candid_UserRole_n44(_uploadFile, _downloadFile, value) {
  return "admin" in value ? "admin" : "user" in value ? "user" : "guest" in value ? "guest" : value;
}
function from_candid_Value_n42(_uploadFile, _downloadFile, value) {
  return from_candid_variant_n43(_uploadFile, _downloadFile, value);
}
function from_candid_record_n12(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    entryType: from_candid_EntryType_n13(_uploadFile, _downloadFile, value.entryType),
    source: from_candid_EntrySource_n14(_uploadFile, _downloadFile, value.source),
    date: value.date,
    note: value.note,
    amount: value.amount
  };
}
function from_candid_record_n32(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    qty: value.qty,
    status: from_candid_Status_n33(_uploadFile, _downloadFile, value.status),
    total: value.total,
    date: value.date,
    productId: value.productId,
    productName: value.productName,
    orderNo: value.orderNo
  };
}
function from_candid_record_n37(_uploadFile, _downloadFile, value) {
  return {
    hasMore: value.hasMore,
    rows: from_candid_vec_n38(_uploadFile, _downloadFile, value.rows)
  };
}
function from_candid_record_n41(_uploadFile, _downloadFile, value) {
  return {
    value: from_candid_Value_n42(_uploadFile, _downloadFile, value.value),
    name: value.name
  };
}
function from_candid_record_n46(_uploadFile, _downloadFile, value) {
  return {
    recentTransactions: from_candid_vec_n47(_uploadFile, _downloadFile, value.recentTransactions),
    summary: value.summary,
    lowStockProducts: value.lowStockProducts
  };
}
function from_candid_record_n49(_uploadFile, _downloadFile, value) {
  return {
    skipped: value.skipped,
    details: from_candid_vec_n50(_uploadFile, _downloadFile, value.details),
    succeeded: value.succeeded
  };
}
function from_candid_record_n52(_uploadFile, _downloadFile, value) {
  return {
    line: value.line,
    reason: from_candid_ImportSkipReason_n53(_uploadFile, _downloadFile, value.reason)
  };
}
function from_candid_record_n57(_uploadFile, _downloadFile, value) {
  return {
    id: value.id,
    entryType: from_candid_EntryType_n13(_uploadFile, _downloadFile, value.entryType),
    balance: value.balance,
    source: from_candid_EntrySource_n14(_uploadFile, _downloadFile, value.source),
    date: value.date,
    note: value.note,
    amount: value.amount
  };
}
function from_candid_variant_n10(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_CashflowEntry_n11(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: from_candid_CashflowError_n15(_uploadFile, _downloadFile, value.err)
  } : value;
}
function from_candid_variant_n19(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: from_candid_ProductError_n20(_uploadFile, _downloadFile, value.err)
  } : value;
}
function from_candid_variant_n2(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: from_candid_Error_n3(_uploadFile, _downloadFile, value.err)
  } : value;
}
function from_candid_variant_n21(_uploadFile, _downloadFile, value) {
  return "emptyName" in value ? {
    __kind__: "emptyName",
    emptyName: value.emptyName
  } : "notFound" in value ? {
    __kind__: "notFound",
    notFound: value.notFound
  } : value;
}
function from_candid_variant_n23(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: value.ok
  } : "err" in value ? {
    __kind__: "err",
    err: from_candid_RestockError_n24(_uploadFile, _downloadFile, value.err)
  } : value;
}
function from_candid_variant_n25(_uploadFile, _downloadFile, value) {
  return "productNotFound" in value ? {
    __kind__: "productNotFound",
    productNotFound: value.productNotFound
  } : "invalidQty" in value ? {
    __kind__: "invalidQty",
    invalidQty: value.invalidQty
  } : value;
}
function from_candid_variant_n30(_uploadFile, _downloadFile, value) {
  return "ok" in value ? {
    __kind__: "ok",
    ok: from_candid_Transaction_n31(_uploadFile, _downloadFile, value.ok)
  } : "err" in value ? {
    __kind__: "err",
    err: from_candid_TransactionError_n34(_uploadFile, _downloadFile, value.err)
  } : value;
}
function from_candid_variant_n35(_uploadFile, _downloadFile, value) {
  return "productNotFound" in value ? {
    __kind__: "productNotFound",
    productNotFound: value.productNotFound
  } : "invalidQty" in value ? {
    __kind__: "invalidQty",
    invalidQty: value.invalidQty
  } : "notFound" in value ? {
    __kind__: "notFound",
    notFound: value.notFound
  } : "insufficientStock" in value ? {
    __kind__: "insufficientStock",
    insufficientStock: value.insufficientStock
  } : value;
}
function from_candid_variant_n4(_uploadFile, _downloadFile, value) {
  return "FrontendOriginsNotConfigured" in value ? {
    __kind__: "FrontendOriginsNotConfigured",
    FrontendOriginsNotConfigured: value.FrontendOriginsNotConfigured
  } : "MixedSsoSources" in value ? {
    __kind__: "MixedSsoSources",
    MixedSsoSources: value.MixedSsoSources
  } : "Stale" in value ? {
    __kind__: "Stale",
    Stale: value.Stale
  } : "MalformedCandid" in value ? {
    __kind__: "MalformedCandid",
    MalformedCandid: value.MalformedCandid
  } : "AmbiguousAttribute" in value ? {
    __kind__: "AmbiguousAttribute",
    AmbiguousAttribute: value.AmbiguousAttribute
  } : "NoAttributes" in value ? {
    __kind__: "NoAttributes",
    NoAttributes: value.NoAttributes
  } : "UnknownNonce" in value ? {
    __kind__: "UnknownNonce",
    UnknownNonce: value.UnknownNonce
  } : "UntrustedSsoSource" in value ? {
    __kind__: "UntrustedSsoSource",
    UntrustedSsoSource: value.UntrustedSsoSource
  } : "MissingField" in value ? {
    __kind__: "MissingField",
    MissingField: value.MissingField
  } : "FrontendOriginMismatch" in value ? {
    __kind__: "FrontendOriginMismatch",
    FrontendOriginMismatch: value.FrontendOriginMismatch
  } : value;
}
function from_candid_variant_n43(_uploadFile, _downloadFile, value) {
  return "int" in value ? {
    __kind__: "int",
    int: value.int
  } : "nat" in value ? {
    __kind__: "nat",
    nat: value.nat
  } : "float" in value ? {
    __kind__: "float",
    float: value.float
  } : "bool" in value ? {
    __kind__: "bool",
    bool: value.bool
  } : "null" in value ? {
    __kind__: "null",
    null: value.null
  } : "text" in value ? {
    __kind__: "text",
    text: value.text
  } : value;
}
function from_candid_variant_n54(_uploadFile, _downloadFile, value) {
  return "emptyLine" in value ? {
    __kind__: "emptyLine",
    emptyLine: value.emptyLine
  } : "invalidRow" in value ? {
    __kind__: "invalidRow",
    invalidRow: value.invalidRow
  } : "invalidNumber" in value ? {
    __kind__: "invalidNumber",
    invalidNumber: value.invalidNumber
  } : "invalidDate" in value ? {
    __kind__: "invalidDate",
    invalidDate: value.invalidDate
  } : value;
}
function from_candid_vec_n38(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_vec_n39(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n39(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Cell_n40(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n47(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_Transaction_n31(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n50(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_ImportSkip_n51(_uploadFile, _downloadFile, x));
}
function from_candid_vec_n55(_uploadFile, _downloadFile, value) {
  return value.map((x) => from_candid_CashflowRow_n56(_uploadFile, _downloadFile, x));
}
function to_candid_EntryType_n8(_uploadFile, _downloadFile, value) {
  return value == "masuk" ? {
    masuk: null
  } : value == "keluar" ? {
    keluar: null
  } : value;
}
function to_candid_NewCashflowEntry_n6(_uploadFile, _downloadFile, value) {
  return to_candid_record_n7(_uploadFile, _downloadFile, value);
}
function to_candid_NewProduct_n16(_uploadFile, _downloadFile, value) {
  return to_candid_record_n17(_uploadFile, _downloadFile, value);
}
function to_candid_NewTransaction_n26(_uploadFile, _downloadFile, value) {
  return to_candid_record_n27(_uploadFile, _downloadFile, value);
}
function to_candid_Status_n28(_uploadFile, _downloadFile, value) {
  return value == "baru" ? {
    baru: null
  } : value == "selesai" ? {
    selesai: null
  } : value == "proses" ? {
    proses: null
  } : value == "kirim" ? {
    kirim: null
  } : value;
}
function to_candid_UserRole_n5(_uploadFile, _downloadFile, value) {
  return value == "admin" ? {
    admin: null
  } : value == "user" ? {
    user: null
  } : value == "guest" ? {
    guest: null
  } : value;
}
function to_candid_record_n17(_uploadFile, _downloadFile, value) {
  return {
    cost: value.cost ? candid_some(value.cost) : candid_none(),
    name: value.name,
    stock: value.stock ? candid_some(value.stock) : candid_none(),
    price: value.price ? candid_some(value.price) : candid_none()
  };
}
function to_candid_record_n27(_uploadFile, _downloadFile, value) {
  return {
    qty: value.qty,
    status: to_candid_Status_n28(_uploadFile, _downloadFile, value.status),
    productId: value.productId,
    orderNo: value.orderNo
  };
}
function to_candid_record_n7(_uploadFile, _downloadFile, value) {
  return {
    entryType: to_candid_EntryType_n8(_uploadFile, _downloadFile, value.entryType),
    note: value.note,
    amount: value.amount
  };
}
function createActor(canisterId, _uploadFile, _downloadFile, options = {}) {
  const agent = options.agent || HttpAgent.createSync({
    ...options.agentOptions
  });
  if (options.agent && options.agentOptions) {
    console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
  }
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions
  });
  return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
const queryKeys = {
  dashboard: ["dashboard"],
  products: ["products"],
  transactions: ["transactions"],
  restocks: ["restocks"],
  cashflow: ["cashflow"],
  cashBalance: ["cashBalance"]
};
function useDashboard() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDashboard();
    },
    enabled: !!actor && !isFetching
  });
}
function useProducts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts();
    },
    enabled: !!actor && !isFetching
  });
}
function useTransactions() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTransactions();
    },
    enabled: !!actor && !isFetching
  });
}
function useRestocks() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.restocks,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listRestocks();
    },
    enabled: !!actor && !isFetching
  });
}
function useCashflow() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.cashflow,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCashflow();
    },
    enabled: !!actor && !isFetching
  });
}
function useCashBalance() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.cashBalance,
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getCashBalance();
    },
    enabled: !!actor && !isFetching
  });
}
function useInvalidateAll() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    void queryClient.invalidateQueries({ queryKey: queryKeys.products });
    void queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
    void queryClient.invalidateQueries({ queryKey: queryKeys.restocks });
    void queryClient.invalidateQueries({ queryKey: queryKeys.cashflow });
    void queryClient.invalidateQueries({ queryKey: queryKeys.cashBalance });
  };
}
function useCreateProduct() {
  const { actor } = useActor(createActor);
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.createProduct(input);
    },
    onSuccess: () => {
      invalidate();
    }
  });
}
function useDeleteProduct() {
  const { actor } = useActor(createActor);
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      invalidate();
    }
  });
}
function useCreateTransaction() {
  const { actor } = useActor(createActor);
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.createTransaction(input);
    },
    onSuccess: () => {
      invalidate();
    }
  });
}
function useUpdateTransactionStatus() {
  const { actor } = useActor(createActor);
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: async (vars) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.updateTransactionStatus(vars.id, vars.status);
    },
    onSuccess: () => {
      invalidate();
    }
  });
}
function useImportTransactions() {
  const { actor } = useActor(createActor);
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: async (raw) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.importTransactions(raw);
    },
    onSuccess: () => {
      invalidate();
    }
  });
}
function useCreateRestock() {
  const { actor } = useActor(createActor);
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.createRestock(input);
    },
    onSuccess: () => {
      invalidate();
    }
  });
}
function useCreateCashflowEntry() {
  const { actor } = useActor(createActor);
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Backend belum siap");
      return actor.createCashflowEntry(input);
    },
    onSuccess: () => {
      invalidate();
    }
  });
}
function toNumber(value) {
  if (value === null || value === void 0) return 0;
  if (typeof value === "bigint") return Number(value);
  return Number.isFinite(value) ? value : 0;
}
function formatRupiah(value) {
  const amount = Math.round(toNumber(value));
  const sign = amount < 0 ? "-" : "";
  const digits = Math.abs(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}Rp ${digits}`;
}
function formatNumber(value) {
  const amount = Math.round(toNumber(value));
  const sign = amount < 0 ? "-" : "";
  return sign + Math.abs(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember"
];
const MONTHS_ID_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des"
];
function timestampToDate(timestamp) {
  if (timestamp === null || timestamp === void 0) return null;
  const ms = typeof timestamp === "bigint" ? Number(timestamp / 1000000n) : Number(timestamp);
  if (!Number.isFinite(ms) || ms <= 0) return null;
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? null : date;
}
function formatDate(timestamp) {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  return `${date.getDate()} ${MONTHS_ID[date.getMonth()]} ${date.getFullYear()}`;
}
function formatDateShort(timestamp) {
  const date = timestampToDate(timestamp);
  if (!date) return "—";
  return `${date.getDate()} ${MONTHS_ID_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}
function statusLabel(status) {
  switch (status) {
    case "baru":
      return "Baru";
    case "proses":
      return "Diproses";
    case "kirim":
      return "Dikirim";
    case "selesai":
      return "Selesai";
    default:
      return status;
  }
}
function entryTypeLabel(entryType) {
  return entryType === "masuk" ? "Masuk" : "Keluar";
}
function entrySourceLabel(source) {
  switch (source) {
    case "transaksi":
      return "Transaksi";
    case "restock":
      return "Restock";
    case "manual":
      return "Manual";
    default:
      return source;
  }
}
function parseRupiah(input) {
  const cleaned = input.replace(/[^\d-]/g, "");
  if (cleaned === "" || cleaned === "-") return 0;
  const parsed = Number.parseInt(cleaned, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}
export {
  createSlot as A,
  Button as B,
  EntryType as E,
  Status as S,
  formatNumber as a,
  formatDateShort as b,
  useComposedRefs as c,
  buttonVariants as d,
  useProducts as e,
  formatRupiah as f,
  useDeleteProduct as g,
  useCreateProduct as h,
  cva as i,
  useCreateTransaction as j,
  useTransactions as k,
  formatDate as l,
  useImportTransactions as m,
  useUpdateTransactionStatus as n,
  Slot as o,
  parseRupiah as p,
  useCreateRestock as q,
  useRestocks as r,
  statusLabel as s,
  useCashflow as t,
  useDashboard as u,
  useCashBalance as v,
  useCreateCashflowEntry as w,
  entryTypeLabel as x,
  entrySourceLabel as y,
  composeRefs as z
};
