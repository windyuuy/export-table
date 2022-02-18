
using System.Collections.Generic;

public class SceneConfig {

	public static List<SceneConfig> Configs = new List<SceneConfig>()
	{
		new SceneConfig(1, "第1章 格莫拉城", 1000),
		new SceneConfig(2, "第2章 纳皮尔乐园", 1200),
	};

	public SceneConfig() { }
	public SceneConfig(int uid, string sceneId, double outingBaseGold)
	{
		this.Uid = uid;
		this.SceneId = sceneId;
		this.OutingBaseGold = outingBaseGold;
	}

	public virtual SceneConfig MergeFrom(SceneConfig source)
	{
		this.Uid = source.Uid;
		this.SceneId = source.SceneId;
		this.OutingBaseGold = source.OutingBaseGold;
		return this;
	}

	public virtual SceneConfig Clone()
	{
		var config = new SceneConfig();
		config.MergeFrom(this);
		return config;
	}

	/// <summary>
	/// uid
	/// </summary>
	public int Uid;

	/// <summary>
	/// 场景名
	/// </summary>
	public string SceneId;

	/// <summary>
	/// 出行基础金币收益
	/// </summary>
	public double OutingBaseGold;

	#region get字段
	public int uid => Uid;
	public string 场景名 => SceneId;
	public double 出行基础金币收益 => OutingBaseGold;
	#endregion
}
